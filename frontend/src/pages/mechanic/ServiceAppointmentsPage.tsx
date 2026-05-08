import { useState, useMemo } from 'react';
import {
    Box, Typography, Card, CardContent, CardActions, Button, Chip, Grid,
    Dialog, DialogTitle, DialogContent, Select, MenuItem,
    FormControl, InputLabel, TextField, IconButton, Divider,
    Stepper, Step, StepLabel, StepContent
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import DescriptionIcon from '@mui/icons-material/Description';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import BuildIcon from '@mui/icons-material/Build';
import VerifiedIcon from '@mui/icons-material/Verified';
import CancelIcon from '@mui/icons-material/Cancel';
import PaymentsIcon from '@mui/icons-material/Payments';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import {
    fetchAllServiceAppointments,
    fetchAllRepairOrders,
    changeServiceAppointmentStatus,
    generateRepairOrder,
    addWorkDescription,
    addFinalDate
} from '@/api/mechanic.api';

const STATUSES = [
    { value: 'SCHEDULED', label: 'Zaplanowana', color: 'warning' as const },
    { value: 'CONFIRMED', label: 'Auto w serwisie', color: 'primary' as const },
    { value: 'IN_PROGRESS', label: 'W trakcie', color: 'info' as const },
    { value: 'COMPLETED', label: 'Zakończona', color: 'success' as const },
    { value: 'CANCELLED', label: 'Anulowana', color: 'error' as const },
];

const getStatusInfo = (status: string) => STATUSES.find(s => s.value === status) || { label: status, color: 'default' as const };

const getStepIndex = (status: string) => {
    switch(status) {
        case 'SCHEDULED': return 0;
        case 'CONFIRMED': return 1;
        case 'IN_PROGRESS': return 2;
        case 'COMPLETED': return 3;
        default: return 0;
    }
};

export default function ServiceAppointmentsPage() {
    const queryClient = useQueryClient();

    const [filterStatus, setFilterStatus] = useState<string>('ACTIVE');
    const [sortOrder, setSortOrder] = useState<string>('DESC');

    const [selectedAppId, setSelectedAppId] = useState<number | null>(null);
    const [costsForm, setCostsForm] = useState<{ key: string; value: number }[]>([]);
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [editDraft, setEditDraft] = useState<{ key: string; value: string }>({ key: '', value: '' });

    const { data: appointments = [], isLoading: isAppsLoading } = useQuery({
        queryKey: ['allServiceAppointments'],
        queryFn: fetchAllServiceAppointments,
        refetchInterval: 15000
    });

    const { data: repairOrders = [], isLoading: isOrdersLoading } = useQuery({
        queryKey: ['allRepairOrders'],
        queryFn: fetchAllRepairOrders,
        refetchInterval: 15000
    });

    const statusMutation = useMutation({
        mutationFn: ({ id, status }: { id: number, status: string }) => changeServiceAppointmentStatus(id, status),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['allServiceAppointments'] }),
    });

    const startRepairMutation = useMutation({
        mutationFn: async (appointmentId: number) => {
            await generateRepairOrder(appointmentId);
            await changeServiceAppointmentStatus(appointmentId, 'IN_PROGRESS');
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['allServiceAppointments'] });
            queryClient.invalidateQueries({ queryKey: ['allRepairOrders'] });
        },
        onError: (error: any) => {
            const errorMsg = error.response?.data || "Wystąpił błąd podczas generowania zlecenia.";
            alert(errorMsg);
        }
    });

    const updateCostsMutation = useMutation({
        mutationFn: ({ id, desc }: { id: number, desc: Record<string, number> }) => addWorkDescription(id, desc),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['allRepairOrders'] }),
    });

    const finishRepairMutation = useMutation({
        mutationFn: async ({ appId, orderId }: { appId: number, orderId: number }) => {
            const nowIso = dayjs().format('YYYY-MM-DDTHH:mm:ss');
            await addFinalDate(orderId, nowIso);
            await changeServiceAppointmentStatus(appId, 'COMPLETED');
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['allServiceAppointments'] });
            queryClient.invalidateQueries({ queryKey: ['allRepairOrders'] });
        },
    });

    const allAppointmentsWithOrders = useMemo(() => {
        return appointments.map((app: any) => {
            const ro = repairOrders.find((ro: any) =>
                ro.appointment?.id === app.id ||
                ro.appointmentId === app.id ||
                ro.appointment_id === app.id
            );
            return { ...app, repairOrder: ro };
        });
    }, [appointments, repairOrders]);

    const filteredAndSortedAppointments = useMemo(() => {
        let filtered = allAppointmentsWithOrders;
        if (filterStatus === 'ACTIVE') {
            filtered = allAppointmentsWithOrders.filter((a: any) => ['SCHEDULED', 'CONFIRMED', 'IN_PROGRESS'].includes(a.serviceStatus || a.status));
        } else if (filterStatus !== 'ALL') {
            filtered = allAppointmentsWithOrders.filter((a: any) => (a.serviceStatus || a.status) === filterStatus);
        }

        return [...filtered].sort((a: any, b: any) => {
            const dateA = a.appointmentDate ? dayjs(a.appointmentDate).valueOf() : 0;
            const dateB = b.appointmentDate ? dayjs(b.appointmentDate).valueOf() : 0;

            return sortOrder === 'DESC' ? dateB - dateA : dateA - dateB;
        });
    }, [allAppointmentsWithOrders, filterStatus, sortOrder]);

    const currentApp = useMemo(() =>
            allAppointmentsWithOrders.find((a: any) => a.id === selectedAppId),
        [selectedAppId, allAppointmentsWithOrders]);

    const currentTotal = useMemo(() => costsForm.reduce((sum, item) => sum + (Number(item.value) || 0), 0), [costsForm]);

    const handleOpenDialog = (app: any) => {
        setSelectedAppId(app.id);
        setEditIndex(null);
        if (app.repairOrder?.workDescription) {
            const desc = app.repairOrder.workDescription;
            setCostsForm(Object.keys(desc).map(key => ({ key, value: desc[key] })));
        } else {
            setCostsForm([]);
        }
    };

    const saveToBackend = (newList: { key: string; value: number }[]) => {
        const orderId = currentApp?.repairOrder?.id;
        if (!orderId) {
            alert("Błąd synchronizacji: Nie wykryto ID polecenia naprawy! Odśwież stronę (F5) i spróbuj ponownie.");
            return;
        }
        const descMap = newList.reduce((acc, c) => ({ ...acc, [c.key]: c.value }), {});
        updateCostsMutation.mutate({ id: orderId, desc: descMap });
    };

    const handleStartAdd = () => { setEditIndex(-1); setEditDraft({ key: '', value: '' }); };
    const handleStartEdit = (index: number) => { setEditIndex(index); setEditDraft({ key: costsForm[index].key, value: costsForm[index].value.toString() }); };
    const handleCancelEdit = () => { setEditIndex(null); };

    const handleSaveEdit = () => {
        if (!editDraft.key.trim()) return;
        const val = Number(editDraft.value) || 0;
        const newCosts = [...costsForm];
        if (editIndex === -1) newCosts.push({ key: editDraft.key.trim(), value: val });
        else if (editIndex !== null) newCosts[editIndex] = { key: editDraft.key.trim(), value: val };

        setCostsForm(newCosts);
        setEditIndex(null);
        saveToBackend(newCosts);
    };

    const handleDelete = (index: number) => {
        if (!window.confirm(`Czy na pewno usunąć pozycję: ${costsForm[index].key}?`)) return;
        const newCosts = costsForm.filter((_, i) => i !== index);
        setCostsForm(newCosts);
        saveToBackend(newCosts);
    };

    const handleFinishRepair = () => {
        const msg = `Czy na pewno chcesz zakończyć naprawę?\n\n` +
            `Pojazd: ${currentApp?.vehicle?.model} (VIN: ${currentApp?.vehicle?.vin})\n` +
            `Klient: ${currentApp?.client?.firstName} ${currentApp?.client?.lastName}\n\n` +
            `Całkowity koszt naprawy: ${currentTotal.toFixed(2)} PLN\n\n` +
            `Tej operacji nie można cofnąć!`;

        if (window.confirm(msg)) {
            finishRepairMutation.mutate({ appId: currentApp.id, orderId: currentApp.repairOrder.id });
        }
    };

    if (isAppsLoading || isOrdersLoading) return <Typography sx={{ p: 4 }}>Ładowanie systemu...</Typography>;

    const currentStatus = currentApp ? (currentApp.serviceStatus || currentApp.status) : '';
    const activeStep = getStepIndex(currentStatus);

    return (
        <Box sx={{ maxWidth: 1200, mx: 'auto', mt: 4, px: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Warsztat</Typography>

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <FormControl sx={{ minWidth: 200 }}>
                        <InputLabel>Filtruj po statusie</InputLabel>
                        <Select value={filterStatus} label="Filtruj po statusie" onChange={(e) => setFilterStatus(e.target.value)}>
                            <MenuItem value="ACTIVE" sx={{ fontWeight: 'bold', color: 'primary.main' }}>Wszystkie Aktywne</MenuItem>
                            <MenuItem value="ALL">Cała historia</MenuItem>
                            <Divider />
                            {STATUSES.map(s => <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>)}
                        </Select>
                    </FormControl>

                    <FormControl sx={{ minWidth: 200 }}>
                        <InputLabel>Sortuj</InputLabel>
                        <Select value={sortOrder} label="Sortuj" onChange={(e) => setSortOrder(e.target.value)}>
                            <MenuItem value="DESC">Od najnowszych (Wg daty)</MenuItem>
                            <MenuItem value="ASC">Od najstarszych (Wg daty)</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </Box>

            <Grid container spacing={3}>
                {filteredAndSortedAppointments.length === 0 && (
                    <Grid size={{ xs: 12 }}><Typography sx={{ textAlign: 'center', color: 'text.secondary', mt: 4 }}>Brak zgłoszeń.</Typography></Grid>
                )}
                {filteredAndSortedAppointments.map((app: any) => {
                    const info = getStatusInfo(app.serviceStatus || app.status);
                    const formattedDate = app.appointmentDate ? dayjs(app.appointmentDate).format('DD.MM.YYYY, HH:mm') : 'Brak daty';

                    return (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={app.id}>
                            <Card elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                        <Typography variant="h6">{formattedDate}</Typography>
                                        <Chip label={info.label} color={info.color} size="small" />
                                    </Box>
                                    <Typography variant="body2" color="text.secondary"><strong>Pojazd:</strong> {app.vehicle?.model}</Typography>
                                    <Typography variant="body2" color="text.secondary"><strong>Klient:</strong> {app.client?.lastName}</Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontStyle: 'italic' }}>"{app.issueDescription}"</Typography>
                                </CardContent>
                                <CardActions>
                                    <Button fullWidth variant="contained" onClick={() => handleOpenDialog(app)}>Zarządzaj</Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>

            <Dialog open={!!currentApp} onClose={() => setSelectedAppId(null)} maxWidth="sm" fullWidth>
                {currentApp && (
                    <>
                        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 'bold', pb: 1 }}>
                            Szczegóły zgłoszenia #{currentApp.id}
                            <IconButton onClick={() => setSelectedAppId(null)} size="small"><CloseIcon /></IconButton>
                        </DialogTitle>

                        <DialogContent sx={{ pb: 0 }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 4, mt: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <PersonIcon color="action" />
                                    <Typography><strong>Klient:</strong> {currentApp.client?.firstName} {currentApp.client?.lastName} ({currentApp.client?.phone})</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <DirectionsCarIcon color="action" />
                                    <Typography><strong>Pojazd:</strong> {currentApp.vehicle?.model} (VIN: {currentApp.vehicle?.vin})</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                    <DescriptionIcon color="action" sx={{ mt: 0.3 }} />
                                    <Typography><strong>Opis:</strong> "{currentApp.issueDescription}"</Typography>
                                </Box>

                                {currentStatus !== 'SCHEDULED' && currentStatus !== 'CONFIRMED' && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                                        <PaymentsIcon color="primary" />
                                        <Typography variant="subtitle1" color="primary.main" sx={{ fontWeight: 'bold' }}>
                                            Aktualna kwota naprawy: {currentTotal.toFixed(2)} PLN
                                        </Typography>
                                    </Box>
                                )}
                            </Box>

                            {currentStatus === 'CANCELLED' ? (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, color: 'error.main', mb: 3 }}>
                                    <CancelIcon fontSize="large" />
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Zgłoszenie zostało anulowane</Typography>
                                </Box>
                            ) : (
                                <Stepper activeStep={activeStep} orientation="vertical" sx={{ mb: 2 }}>
                                    <Step>
                                        <StepLabel icon={<CalendarMonthIcon color={activeStep >= 0 ? "primary" : "action"} />}>
                                            <Typography sx={{ fontWeight: activeStep === 0 ? "bold" : "normal" }}>Planowanie naprawy</Typography>
                                        </StepLabel>
                                    </Step>

                                    <Step>
                                        <StepLabel icon={<CheckBoxIcon color={activeStep >= 1 ? "primary" : "action"} />}>
                                            <Typography sx={{ fontWeight: activeStep === 1 ? "bold" : "normal" }}>Przyjęto auto do serwisu</Typography>
                                        </StepLabel>
                                    </Step>

                                    <Step>
                                        <StepLabel icon={<BuildIcon color={activeStep >= 2 ? "primary" : "action"} />}>
                                            <Typography sx={{ fontWeight: activeStep === 2 ? "bold" : "normal" }}>Auto w trakcie prac serwisowych</Typography>
                                        </StepLabel>
                                        <StepContent>
                                            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                                                {costsForm.length === 0 && editIndex !== -1 && (
                                                    <Typography variant="body2" color="text.secondary">Kosztorys jest pusty.</Typography>
                                                )}

                                                {costsForm.map((item, index) => {
                                                    if (editIndex === index) {
                                                        return (
                                                            <Box key={index} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                                                <TextField size="small" label="Pozycja" value={editDraft.key} onChange={(e) => setEditDraft({...editDraft, key: e.target.value})} sx={{ flex: 2 }} />
                                                                <TextField size="small" label="Cena PLN" type="number" value={editDraft.value} onChange={(e) => setEditDraft({...editDraft, value: e.target.value})} sx={{ flex: 1 }} />
                                                                <IconButton color="success" onClick={handleSaveEdit} disabled={updateCostsMutation.isPending}><CheckIcon /></IconButton>
                                                                <IconButton color="error" onClick={handleCancelEdit}><CloseIcon /></IconButton>
                                                            </Box>
                                                        );
                                                    }
                                                    return (
                                                        <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, bgcolor: 'grey.100', borderRadius: 1 }}>
                                                            <Typography sx={{ flex: 2 }}>{item.key}</Typography>
                                                            <Typography sx={{ flex: 1, fontWeight: 'bold' }}>{item.value.toFixed(2)} PLN</Typography>
                                                            <Box>
                                                                <IconButton size="small" color="primary" onClick={() => handleStartEdit(index)} disabled={editIndex !== null}><EditIcon fontSize="small" /></IconButton>
                                                                <IconButton size="small" color="error" onClick={() => handleDelete(index)} disabled={editIndex !== null}><DeleteIcon fontSize="small" /></IconButton>
                                                            </Box>
                                                        </Box>
                                                    );
                                                })}

                                                {editIndex === -1 && (
                                                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 1 }}>
                                                        <TextField size="small" label="Nowa pozycja" value={editDraft.key} onChange={(e) => setEditDraft({...editDraft, key: e.target.value})} sx={{ flex: 2 }} autoFocus />
                                                        <TextField size="small" label="Cena PLN" type="number" value={editDraft.value} onChange={(e) => setEditDraft({...editDraft, value: e.target.value})} sx={{ flex: 1 }} />
                                                        <IconButton color="success" onClick={handleSaveEdit} disabled={updateCostsMutation.isPending || !editDraft.key}><CheckIcon /></IconButton>
                                                        <IconButton color="error" onClick={handleCancelEdit}><CloseIcon /></IconButton>
                                                    </Box>
                                                )}

                                                {editIndex === null && (
                                                    <Button startIcon={<AddIcon />} onClick={handleStartAdd} sx={{ alignSelf: 'flex-start', mt: 1 }}>
                                                        Dodaj kolejną pozycję
                                                    </Button>
                                                )}
                                            </Box>
                                        </StepContent>
                                    </Step>

                                    <Step>
                                        <StepLabel icon={<VerifiedIcon color={activeStep >= 3 ? "success" : "action"} />}>
                                            <Typography sx={{ fontWeight: activeStep >= 3 ? "bold" : "normal" }}>Naprawa została ukończona</Typography>
                                        </StepLabel>
                                        <StepContent>
                                            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                                                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                                                    Podsumowanie wykonanych prac:
                                                </Typography>
                                                {costsForm.map((item, index) => (
                                                    <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5, bgcolor: 'grey.50', border: '1px solid #eee', borderRadius: 1 }}>
                                                        <Typography sx={{ flex: 2, color: 'text.secondary' }}>{item.key}</Typography>
                                                        <Typography sx={{ flex: 1, fontWeight: 'bold' }}>{item.value.toFixed(2)} PLN</Typography>
                                                    </Box>
                                                ))}
                                            </Box>
                                        </StepContent>
                                    </Step>

                                </Stepper>
                            )}
                        </DialogContent>

                        {currentStatus !== 'CANCELLED' && (
                            <Box sx={{ p: 3, pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {currentStatus === 'SCHEDULED' && (
                                    <Button fullWidth variant="contained" size="large" onClick={() => statusMutation.mutate({ id: currentApp.id, status: 'CONFIRMED' })}>
                                        Potwierdź przyjęcie auta do serwisu
                                    </Button>
                                )}

                                {currentStatus === 'CONFIRMED' && (
                                    <Button fullWidth variant="contained" size="large" onClick={() => startRepairMutation.mutate(currentApp.id)}>
                                        Rozpocznij naprawę
                                    </Button>
                                )}

                                {currentStatus === 'IN_PROGRESS' && (
                                    <Button
                                        fullWidth variant="contained" color="success" size="large"
                                        disabled={editIndex !== null}
                                        onClick={handleFinishRepair}
                                    >
                                        Zakończ naprawę
                                    </Button>
                                )}

                                {currentStatus === 'COMPLETED' && (
                                    <Button fullWidth variant="contained" color="secondary" size="large" onClick={() => alert("Miejsce dla Krzyśka")}>
                                        Wygeneruj fakturę
                                    </Button>
                                )}
                            </Box>
                        )}
                    </>
                )}
            </Dialog>
        </Box>
    );
}