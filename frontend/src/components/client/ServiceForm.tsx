import { useState, useMemo } from 'react';
import { Box, Button, TextField, MenuItem, Alert } from '@mui/material';
import { arrangeServiceAppointment, fetchBookedServiceAppointments } from '@/api/appointments.api';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ServiceType } from '@/types/appointment.types';
import { useLocations } from '@/hooks/useLocations';
import { useMechanicsByLocation } from '@/hooks/useEmployees';
import { useMyVehicles } from '@/hooks/useVehicles';
import { useNavigate } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/pl';

const WORKING_HOURS = [
    '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
];

export default function ServiceForm() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [status, setStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
    const [loading, setLoading] = useState(false);

    // Stany formularza
    const [selectedLocationId, setSelectedLocationId] = useState<number | ''>('');
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedTime, setSelectedTime] = useState<string>('');

    // Pobieranie danych
    const { data: locations, isLoading: isLocationsLoading } = useLocations();
    const { data: clientVehicles, isLoading: isVehiclesLoading } = useMyVehicles();
    const { data: mechanics, isLoading: isEmployeesLoading, isError: isEmployeesError } = useMechanicsByLocation(selectedLocationId);

    const { data: bookedAppointments = [] } = useQuery({
        queryKey: ['bookedServiceAppointments', selectedLocationId, selectedDate],
        queryFn: () => fetchBookedServiceAppointments(Number(selectedLocationId), selectedDate),
        enabled: !!selectedLocationId && !!selectedDate,
        refetchOnMount: 'always',
        staleTime: 0,
        refetchInterval: 15000,
    });

    const serviceLocations = useMemo(() => {
        return locations?.filter((loc: any) =>
            (loc.locationType === 'SERVICE' || loc.locationType === 'HYBRID') && loc.active === true
        ) || [];
    }, [locations]);

    const hasNoEmployees = selectedLocationId !== '' && !isEmployeesLoading && (mechanics?.length === 0 || isEmployeesError);
    const hasNoVehicles = !isVehiclesLoading && clientVehicles?.length === 0;

    const availableSlots = useMemo(() => {
        if (!mechanics || mechanics.length === 0 || !selectedDate) return [];

        const maxCapacity = mechanics.length;
        const availableHours: string[] = [];

        WORKING_HOURS.forEach(time => {
            const appointmentsAtThisTime = bookedAppointments.filter((app: any) => {
                const dateStr = String(app.appointmentDate).replace(' ', 'T');
                const isNotCancelled = app.serviceStatus !== 'CANCELLED';
                return dateStr.includes(`${selectedDate}T${time}`) && isNotCancelled;
            }).length;

            if (appointmentsAtThisTime < maxCapacity) {
                availableHours.push(time);
            }
        });

        return availableHours;
    }, [mechanics, selectedDate, bookedAppointments]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (hasNoEmployees || hasNoVehicles || !selectedDate || !selectedTime) return;

        setLoading(true);
        setStatus(null);

        const formData = new FormData(e.currentTarget);
        const selectedType = formData.get('type') as ServiceType;
        const vehicleId = Number(formData.get('vehicleId'));
        const locationId = Number(formData.get('locationId'));
        const issueDescription = formData.get('issueDescription') as string;

        const finalAppointmentDate = `${selectedDate}T${selectedTime}:00`;

        const data = {
            locationId,
            vehicleId,
            type: selectedType,
            appointmentDate: finalAppointmentDate,
            issueDescription,
        };

        try {
            await arrangeServiceAppointment(data);
            queryClient.invalidateQueries({ queryKey: ['bookedServiceAppointments'] });
            queryClient.invalidateQueries({ queryKey: ['myServiceAppointments'] });
            const selectedLocation = serviceLocations.find((l: any) => l.id === locationId);
            const selectedVehicle = clientVehicles?.find((v: any) => v.id === vehicleId);

            navigate('/client/service-appointment-success', {
                state: {
                    locationName: selectedLocation?.name,
                    locationCity: selectedLocation?.city,
                    vehicleName: selectedVehicle ? `${selectedVehicle.model} (VIN: ${selectedVehicle.vin.substring(0, 8)}...)` : 'Nieznany',
                    appointmentDate: finalAppointmentDate,
                    type: selectedType,
                    issueDescription
                }
            });
        } catch (error) {
            setStatus({ type: 'error', msg: 'Wystąpił błąd podczas zgłaszania naprawy.' });
            setLoading(false);
        }
    };

    if (hasNoVehicles) {
        return (
            <Box sx={{display: 'flex', flexDirection: 'column', gap: 3}}>
                <Alert severity="error">
                    Nie posiadasz żadnego samochodu zarejestrowanego w naszym systemie. Aby umówić się na serwis,
                    skontaktuj się z nami telefonicznie.
                </Alert>
                <Button
                    variant="outlined"
                    color="primary"
                    size="large"
                    onClick={() => navigate('/home')}
                >
                    Powrót do strony głównej
                </Button>
            </Box>
        );
    }

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {status && <Alert severity={status.type}>{status.msg}</Alert>}

            {hasNoEmployees && (
                <Alert severity="warning">
                    Niestety, wybrany warsztat jest obecnie wyłączony z użytku (brak mechaników). Prosimy o wybranie innej lokalizacji.
                </Alert>
            )}

            <TextField
                required
                select
                name="locationId"
                label="Lokalizacja (Serwis)"
                value={selectedLocationId}
                onChange={(e) => {
                    setSelectedLocationId(Number(e.target.value));
                    setSelectedDate('');
                    setSelectedTime('');
                    queryClient.invalidateQueries({ queryKey: ['employees'] });
                }}
                fullWidth
                disabled={isLocationsLoading}
            >
                {serviceLocations?.map((loc: any) => (
                    <MenuItem key={loc.id} value={loc.id}>
                        {loc.name} ({loc.city})
                    </MenuItem>
                ))}
            </TextField>

            <TextField
                required
                select
                name="vehicleId"
                label="Twój pojazd"
                defaultValue=""
                fullWidth
                disabled={isVehiclesLoading || hasNoVehicles || hasNoEmployees}
            >
                {clientVehicles?.map((v: any) => (
                    <MenuItem key={v.id} value={v.id}>
                        {v.model} (VIN: {v.vin ? v.vin.substring(0, 8) + '...' : 'Brak'})
                    </MenuItem>
                ))}
            </TextField>

            <TextField
                required
                select
                name="type"
                label="Rodzaj usługi"
                defaultValue={ServiceType.INSPECTION}
                fullWidth
                disabled={hasNoEmployees}
            >
                <MenuItem value={ServiceType.INSPECTION}>Przegląd</MenuItem>
                <MenuItem value={ServiceType.REPAIR}>Naprawa bieżąca</MenuItem>
                <MenuItem value={ServiceType.TIRE_CHANGE}>Wymiana opon</MenuItem>
                <MenuItem value={ServiceType.OIL_SERVICE}>Serwis olejowy</MenuItem>
                <MenuItem value={ServiceType.FILTER_CHANGE}>Wymiana filtrów</MenuItem>
            </TextField>

            <Box sx={{ display: 'flex', gap: 2 }}>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pl">
                    <DatePicker
                        label="Proponowana data"
                        minDate={dayjs().add(1, 'day')}
                        shouldDisableDate={(date: Dayjs) => date.day() === 0}
                        value={selectedDate ? dayjs(selectedDate) : null}
                        onChange={(newValue) => {
                            if (newValue) {
                                setStatus(null);
                                setSelectedDate(newValue.format('YYYY-MM-DD'));
                                setSelectedTime('');
                            }
                        }}
                        sx={{ width: '100%' }}
                        disabled={hasNoEmployees || !selectedLocationId}
                    />
                </LocalizationProvider>

                <TextField
                    required
                    select
                    label="Godzina"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    fullWidth
                    disabled={!selectedDate || availableSlots.length === 0}
                    helperText={selectedDate && availableSlots.length === 0 ? "Brak wolnych terminów" : ""}
                >
                    {availableSlots.map((time) => (
                        <MenuItem key={time} value={time}>
                            {time}
                        </MenuItem>
                    ))}
                </TextField>
            </Box>

            <TextField
                required
                name="issueDescription"
                label="Opis usterki"
                multiline
                rows={4}
                fullWidth
                disabled={hasNoEmployees}
            />

            <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                <Button
                    variant="outlined"
                    color="inherit"
                    size="large"
                    onClick={() => navigate('/home')}
                    fullWidth
                    disabled={loading}
                >
                    Anuluj
                </Button>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                    disabled={loading || isEmployeesLoading || hasNoEmployees || !selectedLocationId || !selectedTime}
                >
                    {loading ? 'Rejestracja zlecenia...' : 'Zgłoś do serwisu'}
                </Button>
            </Box>
        </Box>
    );
}