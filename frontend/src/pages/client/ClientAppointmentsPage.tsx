import { useState } from 'react';
import { Box, Typography, Tabs, Tab, Card, CardContent, CardActions, Button, Chip, CircularProgress, Alert } from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchMySalonAppointments, fetchMyServiceAppointments, cancelSalonAppointment, cancelServiceAppointment } from '@/api/appointments.api';
import dayjs from 'dayjs';

const getStatusInfo = (status: string) => {
    switch (status) {
        case 'SCHEDULED': return { label: 'Zaplanowana', color: 'secondary' as const };
        case 'CONFIRMED': return { label: 'Potwierdzona', color: 'primary' as const };
        case 'COMPLETED': return { label: 'Zakończona', color: 'success' as const };
        case 'CANCELLED': return { label: 'Anulowana', color: 'error' as const };
        default: return { label: status || 'Brak statusu', color: 'default' as const };
    }
};

const getAppointmentTypeLabel = (typeStr: string) => {
    switch (typeStr) {
        case 'CONSULTATION': return 'Konsultacja';
        case 'VIEWING': return 'Oględziny auta';
        case 'TEST_DRIVE': return 'Jazda próbna';
        case 'PURCHASE': return 'Zakup';
        case 'INSPECTION': return 'Przegląd';
        case 'REPAIR': return 'Naprawa bieżąca';
        case 'TIRE_CHANGE': return 'Wymiana opon';
        case 'OIL_SERVICE': return 'Serwis olejowy';
        case 'FILTER_CHANGE': return 'Wymiana filtrów';
        default: return typeStr || 'Brak danych';
    }
};

function CustomTabPanel(props: { children?: React.ReactNode; index: number; value: number }) {
    const { children, value, index, ...other } = props;
    return (
        <div role="tabpanel" hidden={value !== index} {...other}>
            {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
        </div>
    );
}

export default function ClientAppointmentsPage() {
    const [tabIndex, setTabIndex] = useState(0);
    const queryClient = useQueryClient();

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    };

    const {
        data: salonAppointments = [],
        isLoading: isSalonLoading,
        isError: isSalonError
    } = useQuery({
        queryKey: ['mySalonAppointments'],
        queryFn: fetchMySalonAppointments,
        refetchOnMount: 'always',
    });

    const {
        data: serviceAppointments = [],
        isLoading: isServiceLoading,
        isError: isServiceError
    } = useQuery({
        queryKey: ['myServiceAppointments'],
        queryFn: fetchMyServiceAppointments,
        refetchOnMount: 'always',
    });

    const cancelSalonMutation = useMutation({
        mutationFn: cancelSalonAppointment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['mySalonAppointments'] });
            queryClient.invalidateQueries({ queryKey: ['bookedSalonAppointments'] });
        },
    });

    const cancelServiceMutation = useMutation({
        mutationFn: cancelServiceAppointment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['myServiceAppointments'] });
            queryClient.invalidateQueries({ queryKey: ['bookedServiceAppointments'] });
        },
    });

    const handleCancel = (id: number, type: 'SALON' | 'SERVICE') => {
        if (window.confirm('Czy na pewno chcesz anulować tę wizytę?')) {
            if (type === 'SALON') {
                cancelSalonMutation.mutate(id);
            } else if (type === 'SERVICE') {
                cancelServiceMutation.mutate(id);
            }
        }
    };

    const renderAppointmentCard = (app: any, type: 'SALON' | 'SERVICE') => {
        if (!app) return null;

        const actualStatus = type === 'SERVICE' ? app?.serviceStatus : app?.status;
        const actualType = app?.type || app?.serviceType;

        const statusInfo = getStatusInfo(actualStatus);
        const formattedDate = app?.appointmentDate ? dayjs(app.appointmentDate).format('DD.MM.YYYY, HH:mm') : 'Brak daty';
        const locationName = app?.location ? `${app.location.name} (${app.location.city})` : 'Brak lokalizacji';

        const appointmentGoal = getAppointmentTypeLabel(actualType);
        const typeLabel = 'Typ wizyty';

        const canBeCancelled = actualStatus !== 'CANCELLED' && actualStatus !== 'COMPLETED' && actualStatus !== 'CONFIRMED';

        return (
            <Box key={app.id || Math.random()} sx={{ height: '100%' }}>
                <Card elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 2 }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                {formattedDate}
                            </Typography>
                            <Chip
                                label={statusInfo.label}
                                color={statusInfo.color}
                                size="small"
                            />
                        </Box>

                        <Typography color="text.secondary" gutterBottom>
                            <strong>Lokalizacja:</strong> {locationName}
                        </Typography>

                        <Typography color="text.secondary" gutterBottom>
                            <strong>{typeLabel}</strong> {appointmentGoal}
                        </Typography>

                        {app?.employee && (
                            <Typography color="text.secondary" gutterBottom>
                                <strong>Pracownik:</strong> {app.employee.firstName} {app.employee.lastName}
                            </Typography>
                        )}

                        {app?.vehicle && (
                            <Typography color="text.secondary">
                                <strong>Pojazd:</strong> {app.vehicle.model}
                            </Typography>
                        )}

                        {type === 'SERVICE' && app?.issueDescription && (
                            <Typography color="text.secondary" sx={{ mt: 1, fontStyle: 'italic' }}>
                                <strong>Opis:</strong> {app.issueDescription}
                            </Typography>
                        )}
                    </CardContent>

                    <CardActions sx={{ p: 2, pt: 0, justifyContent: 'flex-end', minHeight: 48 }}>
                        {canBeCancelled && (
                            <Button
                                size="small"
                                variant="text"
                                color="error"
                                onClick={() => handleCancel(app.id, type)}
                                disabled={cancelSalonMutation.isPending || cancelServiceMutation.isPending}
                            >
                                {cancelSalonMutation.isPending || cancelServiceMutation.isPending ? 'Anulowanie...' : 'Anuluj'}
                            </Button>
                        )}
                    </CardActions>
                </Card>
            </Box>
        );
    };

    const safeSalonAppointments = Array.isArray(salonAppointments) ? salonAppointments : [];
    const safeServiceAppointments = Array.isArray(serviceAppointments) ? serviceAppointments : [];

    return (
        <Box sx={{ maxWidth: 1000, mx: 'auto', mt: 4, px: 2 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4 }}>
                Moje wizyty
            </Typography>

            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabIndex} onChange={handleTabChange} variant="fullWidth">
                    <Tab label="Salon" />
                    <Tab label="Serwis" />
                </Tabs>
            </Box>

            {/* ZAKŁADKA 1: SALON */}
            <CustomTabPanel value={tabIndex} index={0}>
                {isSalonLoading && <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 4 }} />}
                {isSalonError && <Alert severity="error">Nie udało się pobrać wizyt w salonie.</Alert>}

                {!isSalonLoading && !isSalonError && safeSalonAppointments.length === 0 && (
                    <Typography color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
                        Nie masz zaplanowanych żadnych wizyt w salonie.
                    </Typography>
                )}

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
                    {safeSalonAppointments.map((app: any) => renderAppointmentCard(app, 'SALON'))}
                </Box>
            </CustomTabPanel>

            {/* ZAKŁADKA 2: SERWIS */}
            <CustomTabPanel value={tabIndex} index={1}>
                {isServiceLoading && <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 4 }} />}
                {isServiceError && <Alert severity="error">Nie udało się pobrać zgłoszeń serwisowych.</Alert>}

                {!isServiceLoading && !isServiceError && safeServiceAppointments.length === 0 && (
                    <Typography color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
                        Nie masz żadnych zgłoszeń w serwisie.
                    </Typography>
                )}

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
                    {safeServiceAppointments.map((app: any) => renderAppointmentCard(app, 'SERVICE'))}
                </Box>
            </CustomTabPanel>
        </Box>
    );
}