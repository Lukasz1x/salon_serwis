import { useState, useMemo } from 'react';
import { Box, Button, TextField, MenuItem, Alert } from '@mui/material';
import { arrangeSalonAppointment, fetchBookedSalonAppointments } from '@/api/appointments.api';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { SalonAppointmentType } from '@/types/appointment.types';
import { useLocations } from '@/hooks/useLocations';
import { useGetVehicles } from '@/hooks/useVehicles';
import { useSalesRepsByLocation } from '@/hooks/useEmployees';
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

export default function SalonForm() {
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
    const { data: vehicles, isLoading: isVehiclesLoading } = useGetVehicles(Number(selectedLocationId));
    const { data: salesReps, isLoading: isEmployeesLoading, isError: isEmployeesError } = useSalesRepsByLocation(selectedLocationId);

    const { data: bookedAppointments = [] } = useQuery({
        queryKey: ['bookedSalonAppointments', selectedLocationId, selectedDate],
        queryFn: () => fetchBookedSalonAppointments(Number(selectedLocationId), selectedDate),
        enabled: !!selectedLocationId && !!selectedDate, // Zapytanie wyjdzie tylko, jeśli oba parametry nie są puste
    });

    const salonLocations = useMemo(() => {
        return locations?.filter((loc: any) => loc.locationType === 'SALON' || loc.locationType === 'HYBRID') || [];
    }, [locations]);

    const hasNoEmployees = selectedLocationId !== '' && !isEmployeesLoading && (salesReps?.length === 0 || isEmployeesError);

    const availableSlots = useMemo(() => {
        if (!salesReps || salesReps.length === 0 || !selectedDate) return {};

        const slotsInfo: Record<string, any[]> = {};

        WORKING_HOURS.forEach(time => {
            const busyEmployeeIds = bookedAppointments
                .filter((app: any) => {
                    const dateStr = String(app.appointmentDate).replace(' ', 'T');
                    return dateStr.includes(`${selectedDate}T${time}`);
                })
                .map((app: any) => {
                    const id = app.employee?.id || app.employeeId || app.user?.id;
                    return String(id);
                });

            const freeReps = salesReps.filter((rep: any) => {
                const repIdStr = String(rep.id);
                return !busyEmployeeIds.includes(repIdStr);
            });

            if (freeReps.length > 0) {
                slotsInfo[time] = freeReps;
            }
        });

        return slotsInfo;
    }, [salesReps, selectedDate, bookedAppointments]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (hasNoEmployees || !salesReps || !selectedDate || !selectedTime) return;

        setLoading(true);
        setStatus(null);

        const availableRepsForSlot = availableSlots[selectedTime];
        const randomIndex = Math.floor(Math.random() * availableRepsForSlot.length);
        const assignedEmployee = availableRepsForSlot[randomIndex];

        const formData = new FormData(e.currentTarget);
        const vehicleVal = formData.get('vehicleId');
        const parsedVehicleId = vehicleVal ? Number(vehicleVal) : undefined;
        const selectedType = formData.get('type') as SalonAppointmentType;

        const finalAppointmentDate = `${selectedDate}T${selectedTime}:00`;

        const data = {
            locationId: Number(formData.get('locationId')),
            employeeId: assignedEmployee.id,
            vehicleId: parsedVehicleId,
            type: selectedType,
            appointmentDate: finalAppointmentDate,
            notes: formData.get('notes') as string,
        };

        try {
            await arrangeSalonAppointment(data as any);
            queryClient.invalidateQueries({ queryKey: ['bookedSalonAppointments'] });
            const selectedLocation = salonLocations.find((l: any) => l.id === data.locationId);
            const selectedVehicle = vehicles?.find((v: any) => v.id === data.vehicleId);

            navigate('/client/salon-appointment-success', {
                state: {
                    locationName: selectedLocation?.name,
                    locationCity: selectedLocation?.city,
                    employeeName: `${assignedEmployee.firstName} ${assignedEmployee.lastName}`,
                    vehicleName: selectedVehicle ? selectedVehicle.model : 'Brak wybranego',
                    appointmentDate: finalAppointmentDate,
                    type: selectedType
                }
            });
        } catch (error) {
            setStatus({ type: 'error', msg: 'Wystąpił błąd podczas umawiania wizyty. Spróbuj ponownie.' });
            setLoading(false);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {status && <Alert severity={status.type}>{status.msg}</Alert>}

            {hasNoEmployees && (
                <Alert severity="warning">
                    Niestety, wybrany salon jest obecnie wyłączony z użytku (brak sprzedawców). Prosimy o wybranie innej lokalizacji.
                </Alert>
            )}

            <TextField
                required
                select
                name="locationId"
                label="Lokalizacja (Salon)"
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
                {salonLocations?.map((loc: any) => (
                    <MenuItem key={loc.id} value={loc.id}>
                        {loc.name} ({loc.city})
                    </MenuItem>
                ))}
            </TextField>

            <TextField
                select
                name="vehicleId"
                label="Pojazd (Opcjonalnie)"
                defaultValue=""
                fullWidth
                disabled={!selectedLocationId || isVehiclesLoading || hasNoEmployees}
            >
                <MenuItem value="">
                    <em>Brak konkretnego pojazdu / Nie wiem</em>
                </MenuItem>
                {vehicles?.map((v: any) => (
                    <MenuItem key={v.id} value={v.id}>
                        {v.model}
                    </MenuItem>
                ))}
            </TextField>

            <TextField
                required
                select
                name="type"
                label="Cel wizyty"
                defaultValue={SalonAppointmentType.CONSULTATION}
                fullWidth
                disabled={hasNoEmployees}
            >
                <MenuItem value={SalonAppointmentType.CONSULTATION}>Konsultacja</MenuItem>
                <MenuItem value={SalonAppointmentType.VIEWING}>Oględziny auta</MenuItem>
                <MenuItem value={SalonAppointmentType.TEST_DRIVE}>Jazda próbna</MenuItem>
                <MenuItem value={SalonAppointmentType.PURCHASE}>Zakup</MenuItem>
            </TextField>

            <Box sx={{ display: 'flex', gap: 2 }}>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pl">
                    <DatePicker
                        label="Data wizyty"
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
                    disabled={!selectedDate || Object.keys(availableSlots).length === 0}
                    helperText={selectedDate && Object.keys(availableSlots).length === 0 ? "Brak wolnych terminów" : ""}
                >
                    {Object.keys(availableSlots).map((time) => (
                        <MenuItem key={time} value={time}>
                            {time}
                        </MenuItem>
                    ))}
                </TextField>
            </Box>

            <TextField
                name="notes"
                label="Dodatkowe uwagi"
                multiline
                rows={3}
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
                    disabled={loading || isEmployeesLoading || hasNoEmployees || !selectedTime}
                >
                    {loading ? 'Umawianie...' : 'Potwierdź wizytę'}
                </Button>
            </Box>
        </Box>
    );
}