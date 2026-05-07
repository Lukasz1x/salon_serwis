import { useState, useMemo } from 'react';
import { Box, Button, TextField, MenuItem, Alert } from '@mui/material';
import { arrangeServiceAppointment } from '@/api/appointments.api';
import { ServiceType } from '@/types/appointment.types';
import { useLocations } from '@/hooks/useLocations';
import { useMechanicsByLocation } from '@/hooks/useEmployees';
import { useMyVehicles } from '@/hooks/useVehicles';
import { useNavigate } from 'react-router-dom';

export default function ServiceForm() {
    const navigate = useNavigate();

    const [status, setStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
    const [loading, setLoading] = useState(false);
    const [selectedLocationId, setSelectedLocationId] = useState<number | ''>('');

    const { data: locations, isLoading: isLocationsLoading } = useLocations();
    const { data: clientVehicles, isLoading: isVehiclesLoading } = useMyVehicles();

    const {
        data: mechanics,
        isLoading: isEmployeesLoading,
        isError: isEmployeesError
    } = useMechanicsByLocation(selectedLocationId);

    const serviceLocations = useMemo(() => {
        return locations?.filter((loc: any) =>
            loc.locationType === 'SERVICE' || loc.locationType === 'HYBRID'
        ) || [];
    }, [locations]);

    const defaultDate = useMemo(() => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(9, 0, 0, 0);
        return tomorrow.toISOString().slice(0, 16);
    }, []);

    const hasNoEmployees = selectedLocationId !== '' && !isEmployeesLoading && (mechanics?.length === 0 || isEmployeesError);
    const hasNoVehicles = !isVehiclesLoading && clientVehicles?.length === 0;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (hasNoEmployees || hasNoVehicles) return;

        setLoading(true);
        setStatus(null);

        const randomIndex = Math.floor(Math.random() * mechanics!.length);
        const assignedMechanic = mechanics![randomIndex];

        const formData = new FormData(e.currentTarget);
        const selectedType = formData.get('type') as ServiceType;
        const selectedDate = formData.get('appointmentDate') as string;
        const vehicleId = Number(formData.get('vehicleId'));
        const locationId = Number(formData.get('locationId'));
        const issueDescription = formData.get('issueDescription') as string;

        const data = {
            locationId,
            vehicleId,
            employeeId: assignedMechanic.id,
            type: selectedType,
            appointmentDate: selectedDate,
            issueDescription,
        };

        try {
            await arrangeServiceAppointment(data);

            const selectedLocation = serviceLocations.find((l: any) => l.id === locationId);
            const selectedVehicle = clientVehicles?.find((v: any) => v.id === vehicleId);

            navigate('/client/service-appointment-success', {
                state: {
                    locationName: selectedLocation?.name,
                    locationCity: selectedLocation?.city,
                    vehicleName: selectedVehicle ? `${selectedVehicle.model} (VIN: ${selectedVehicle.vin.substring(0, 8)}...)` : 'Nieznany',
                    employeeName: `${assignedMechanic.firstName} ${assignedMechanic.lastName}`,
                    appointmentDate: selectedDate,
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
                    Niestety, wybrany warsztat nie posiada obecnie przypisanych mechaników. Prosimy o wybranie innej lokalizacji.
                </Alert>
            )}

            <TextField
                required
                select
                name="locationId"
                label="Lokalizacja (Serwis)"
                value={selectedLocationId}
                onChange={(e) => setSelectedLocationId(Number(e.target.value))}
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

            <TextField
                required
                name="appointmentDate"
                label="Proponowana data"
                type="datetime-local"
                defaultValue={defaultDate}
                slotProps={{ inputLabel: { shrink: true } }}
                fullWidth
                disabled={hasNoEmployees}
            />

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
                    disabled={loading || isEmployeesLoading || hasNoEmployees || !selectedLocationId}
                >
                    {loading ? 'Rejestracja zlecenia...' : 'Zgłoś do serwisu'}
                </Button>
            </Box>
        </Box>
    );
}