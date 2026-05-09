import { useState, useMemo } from 'react';
import {
    Box, Typography, Card, CardContent, CardActions, Button, Chip, Grid,
    Dialog, DialogTitle, DialogContent, IconButton, Divider,
    FormControl, InputLabel, Select, MenuItem, Stepper, Step, StepLabel, Paper,
    Alert
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import NoteIcon from '@mui/icons-material/Note';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SearchIcon from '@mui/icons-material/Search';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import {
    fetchAllSalonAppointments,
    changeSalonAppointmentStatus,
    fetchCurrentUserStats
} from '@/api/salon.api';

const STATUSES = [
    { value: 'SCHEDULED', label: 'Zaplanowana', color: 'warning' as const },
    { value: 'CONFIRMED', label: 'Potwierdzona', color: 'info' as const },
    { value: 'COMPLETED', label: 'Zrealizowana', color: 'success' as const },
    { value: 'CANCELLED', label: 'Anulowana', color: 'error' as const },
];

const TYPES = [
    { value: 'TEST_DRIVE', label: 'Jazda próbna' },
    { value: 'CONSULTATION', label: 'Konsultacja' },
];

const getStatusInfo = (status: string) => STATUSES.find(s => s.value === status) || { label: status, color: 'default' as const };
const getTypeLabel = (type: string) => TYPES.find(t => t.value === type)?.label || type;

const getStepIndex = (status: string) => {
    switch(status) {
        case 'SCHEDULED': return 0;
        case 'CONFIRMED': return 1;
        case 'COMPLETED': return 2;
        default: return 0;
    }
};

export default function SalonAppointmentsPage() {
    const queryClient = useQueryClient();

    const [filterStatus, setFilterStatus] = useState<string>('ACTIVE');
    const [filterType, setFilterType] = useState<string>('ALL');
    const [sortOrder, setSortOrder] = useState<string>('DATE_DESC');
    const [selectedAppId, setSelectedAppId] = useState<number | null>(null);

    const { data: userStats = [] } = useQuery({
        queryKey: ['currentUserStats'],
        queryFn: fetchCurrentUserStats
    });

    const currentUserId = userStats[0]?.id;

    const { data: appointments = [], isLoading } = useQuery({
        queryKey: ['allSalonAppointments'],
        queryFn: fetchAllSalonAppointments,
        refetchInterval: 15000
    });

    const statusMutation = useMutation({
        mutationFn: ({ id, status }: { id: number, status: string }) => changeSalonAppointmentStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['allSalonAppointments'] });
        },
    });

    const filteredAndSortedAppointments = useMemo(() => {
        let filtered = appointments;

        if (currentUserId) {
            filtered = filtered.filter((a: any) => a.employee?.id === currentUserId);
        }

        if (filterStatus === 'ACTIVE') {
            filtered = filtered.filter((a: any) => ['SCHEDULED', 'CONFIRMED'].includes(a.status));
        } else if (filterStatus !== 'ALL') {
            filtered = filtered.filter((a: any) => a.status === filterStatus);
        }

        if (filterType !== 'ALL') {
            filtered = filtered.filter((a: any) => a.type === filterType);
        }

        return [...filtered].sort((a: any, b: any) => {
            const dateA = dayjs(a.appointmentDate).valueOf();
            const dateB = dayjs(b.appointmentDate).valueOf();
            return sortOrder === 'DATE_DESC' ? dateB - dateA : dateA - dateB;
        });
    }, [appointments, filterStatus, filterType, sortOrder, currentUserId]);

    const currentApp = useMemo(() => appointments.find((a: any) => a.id === selectedAppId), [selectedAppId, appointments]);

    if (isLoading) return <Typography sx={{ p: 4 }}>Ładowanie kalendarza salonu...</Typography>;

    return (
        <Box sx={{ maxWidth: 1200, mx: 'auto', mt: 4, px: 2 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>Spotkania w salonie</Typography>

            <Paper elevation={2} sx={{ p: 2, mb: 4, bgcolor: 'background.paper', borderRadius: 2 }}>
                <Grid container spacing={2} sx={{ alignItems: 'center' }}>
                    <Grid size="auto"><SearchIcon color="action" sx={{ mt: 1 }} /></Grid>

                    <Grid size={{ xs: 12, sm: 3 }}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Status</InputLabel>
                            <Select value={filterStatus} label="Status" onChange={(e) => setFilterStatus(e.target.value)}>
                                <MenuItem value="ACTIVE" sx={{ fontWeight: 'bold', color: 'primary.main' }}>Wszystkie Aktywne</MenuItem>
                                <MenuItem value="ALL">Cała historia</MenuItem>
                                <Divider />
                                {STATUSES.map(s => <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 3 }}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Typ spotkania</InputLabel>
                            <Select value={filterType} label="Typ spotkania" onChange={(e) => setFilterType(e.target.value)}>
                                <MenuItem value="ALL">Wszystkie typy</MenuItem>
                                <Divider />
                                {TYPES.map(t => <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 3 }}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Sortuj wg daty</InputLabel>
                            <Select value={sortOrder} label="Sortuj wg daty" onChange={(e) => setSortOrder(e.target.value)}>
                                <MenuItem value="DATE_DESC">Od najnowszych</MenuItem>
                                <MenuItem value="DATE_ASC">Od najstarszych</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </Paper>

            <Grid container spacing={3}>
                {filteredAndSortedAppointments.map((app: any) => {
                    const info = getStatusInfo(app.status);
                    const isToday = dayjs(app.appointmentDate).isSame(dayjs(), 'day');
                    return (
                        <Grid size={{ xs: 12, md: 6 }} key={app.id}>
                            <Card elevation={isToday ? 6 : 3} sx={{
                                height: '100%', display: 'flex', flexDirection: 'column',
                                borderLeft: isToday ? '6px solid #1976d2' : 'none',
                                transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' }
                            }}>
                                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                        <Box>
                                            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{dayjs(app.appointmentDate).format('HH:mm')}</Typography>
                                            <Typography variant="subtitle1" color="text.secondary">{dayjs(app.appointmentDate).format('DD MMMM YYYY')}</Typography>
                                        </Box>
                                        <Chip label={info.label} color={info.color} size="small" sx={{ fontWeight: 'bold' }} />
                                    </Box>
                                    <Divider sx={{ mb: 2 }} />
                                    <Typography variant="h6" color="primary.main" gutterBottom sx={{ fontWeight: 'bold' }}>{app.client?.firstName} {app.client?.lastName}</Typography>
                                    <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1, fontWeight: 'medium' }}>
                                        <DirectionsCarIcon fontSize="small" color="action" /> {app.vehicle?.model || 'Rozmowa ogólna'}
                                    </Typography>
                                    <Typography variant="body1" color="secondary.main" sx={{ mt: 1.5, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <NoteIcon fontSize="small" /> Typ: {getTypeLabel(app.type)}
                                    </Typography>
                                </CardContent>
                                <CardActions sx={{ p: 2, pt: 0 }}>
                                    <Button fullWidth variant="contained" size="large" onClick={() => setSelectedAppId(app.id)} sx={{ fontWeight: 'bold' }}>Zarządzaj</Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>

            <Dialog open={!!currentApp} onClose={() => setSelectedAppId(null)} maxWidth="sm" fullWidth>
                {currentApp && (
                    <>
                        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 'bold' }}>
                            Szczegóły spotkania #{currentApp.id}
                            <IconButton onClick={() => setSelectedAppId(null)}><CloseIcon /></IconButton>
                        </DialogTitle>
                        <Divider />
                        <DialogContent>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4, mt: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}><PersonIcon color="primary"/><Typography><strong>Klient:</strong> {currentApp.client?.firstName} {currentApp.client?.lastName} ({currentApp.client?.phone || 'Brak'})</Typography></Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}><CalendarMonthIcon color="primary"/><Typography><strong>Termin:</strong> {dayjs(currentApp.appointmentDate).format('DD.MM.YYYY, HH:mm')}</Typography></Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}><DirectionsCarIcon color="primary"/><Typography><strong>Pojazd:</strong> {currentApp.vehicle?.model || 'Brak'}</Typography></Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}><LocationOnIcon color="primary"/><Typography><strong>Lokalizacja:</strong> {currentApp.location?.name}</Typography></Box>
                                {currentApp.notes && (
                                    <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50', display: 'flex', gap: 2, mt: 1 }}>
                                        <NoteIcon color="action" sx={{ mt: 0.5 }}/><Typography variant="body2"><strong>Notatki:</strong> "{currentApp.notes}"</Typography>
                                    </Paper>
                                )}
                            </Box>

                            <Stepper activeStep={getStepIndex(currentApp.status)} alternativeLabel sx={{ mb: 4 }}>
                                <Step><StepLabel>Zaplanowana</StepLabel></Step>
                                <Step><StepLabel>Potwierdzona</StepLabel></Step>
                                <Step><StepLabel>Zakończona</StepLabel></Step>
                            </Stepper>

                            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {currentApp.status === 'SCHEDULED' && (
                                    <Button variant="contained" size="large" fullWidth onClick={() => statusMutation.mutate({ id: currentApp.id, status: 'CONFIRMED' })}>Potwierdź przybycie klienta</Button>
                                )}
                                {currentApp.status === 'CONFIRMED' && (
                                    <Button variant="contained" color="success" size="large" fullWidth onClick={() => statusMutation.mutate({ id: currentApp.id, status: 'COMPLETED' })}>Zakończ spotkanie</Button>
                                )}

                                {currentApp.status === 'COMPLETED' && (
                                    <Alert severity="success">To spotkanie zostało pomyślnie zakończone.</Alert>
                                )}
                                {currentApp.status === 'CANCELLED' && (
                                    <Alert severity="error">To spotkanie zostało anulowane.</Alert>
                                )}
                            </Box>
                        </DialogContent>
                    </>
                )}
            </Dialog>
        </Box>
    );
}