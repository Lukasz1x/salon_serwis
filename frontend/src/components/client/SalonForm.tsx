import { useState, useMemo } from 'react';
import { Box, Button, TextField, MenuItem, Alert, Typography } from '@mui/material';
import { arrangeSalonAppointment } from '@/api/appointments.api';
import { SalonAppointmentType } from '@/types/appointment.types';
import { useLocations } from '@/hooks/useLocations';
import { useGetVehicles } from '@/hooks/useVehicles';
import { useSalesRepsByLocation } from '@/hooks/useEmployees';
import { useNavigate } from 'react-router-dom';

export default function SalonForm() {
    const navigate = useNavigate();
    const [status, setStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
    const [loading, setLoading] = useState(false);
    const [selectedLocationId, setSelectedLocationId] = useState<number | ''>('');

    const { data: locations, isLoading: isLocationsLoading } = useLocations();
    const { data: vehicles, isLoading: isVehiclesLoading } = useGetVehicles(Number(selectedLocationId));
    const { data: salesReps, isLoading: isEmployeesLoading, isError: isEmployeesError } = useSalesRepsByLocation(selectedLocationId);

    const salonLocations = useMemo(() => {
        return locations?.filter((loc: any) => loc.locationType === 'SALON' || loc.locationType === 'HYBRID') || [];
    }, [locations]);

    const defaultDate = useMemo(() => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(12, 0, 0, 0);
        return tomorrow.toISOString().slice(0, 16);
    }, []);

    const hasNoEmployees = selectedLocationId !== '' && !isEmployeesLoading && (salesReps?.length === 0 || isEmployeesError);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (hasNoEmployees || !salesReps) return;

        setLoading(true);
        setStatus(null);

        const randomIndex = Math.floor(Math.random() * salesReps.length);
        const assignedEmployee = salesReps[randomIndex]; // Zapisujemy cały obiekt pracownika

        const formData = new FormData(e.currentTarget);
        const vehicleVal = formData.get('vehicleId');
        const parsedVehicleId = vehicleVal ? Number(vehicleVal) : undefined;
        const selectedType = formData.get('type') as SalonAppointmentType;
        const selectedDate = formData.get('appointmentDate') as string;

        const data = {
            locationId: Number(formData.get('locationId')),
            employeeId: assignedEmployee.id,
            vehicleId: parsedVehicleId,
            type: selectedType,
            appointmentDate: selectedDate,
            notes: formData.get('notes') as string,
        };

        try {
            await arrangeSalonAppointment(data as any);

            const selectedLocation = salonLocations.find((l: any) => l.id === data.locationId);
            const selectedVehicle = vehicles?.find((v: any) => v.id === data.vehicleId);

            navigate('/client/salon-appointment-success', {
                state: {
                    locationName: selectedLocation?.name,
                    locationCity: selectedLocation?.city,
                    employeeName: `${assignedEmployee.firstName} ${assignedEmployee.lastName}`,
                    vehicleName: selectedVehicle ? selectedVehicle.model : 'Brak wybranego',
                    appointmentDate: selectedDate,
                    type: selectedType
                }
            });
        } catch (error) {
            setStatus({ type: 'error', msg: 'Wystąpił błąd podczas umawiania wizyty. Spróbuj ponownie później.' });
            setLoading(false);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {status && <Alert severity={status.type}>{status.msg}</Alert>}

            {hasNoEmployees && (
                <Alert severity="warning">
                    Niestety, wybrany salon nie posiada obecnie przypisanych sprzedawców. Prosimy o wybranie innej lokalizacji.
                </Alert>
            )}

            <TextField
                required
                select
                name="locationId"
                label="Lokalizacja (Salon)"
                value={selectedLocationId}
                onChange={(e) => setSelectedLocationId(Number(e.target.value))}
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
                helperText={!selectedLocationId ? "Wybierz najpierw salon" : ""}
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

            <TextField
                required
                name="appointmentDate"
                label="Data i godzina wizyty"
                type="datetime-local"
                defaultValue={defaultDate}
                InputLabelProps={{ shrink: true }}
                fullWidth
                disabled={hasNoEmployees}
            />

            <TextField
                name="notes"
                label="Dodatkowe uwagi"
                multiline
                rows={3}
                fullWidth
                disabled={hasNoEmployees}
            />

            <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                disabled={loading || isEmployeesLoading || hasNoEmployees}
            >
                {loading ? 'Umawianie...' : 'Potwierdź wizytę'}
            </Button>
        </Box>
    );
}