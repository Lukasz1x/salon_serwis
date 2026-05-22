import { useState, useMemo } from 'react';
import {
    Box, Typography, Card, CardContent, CardActions, Button, Chip, Grid,
    Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem,
    FormControl, InputLabel, IconButton, Divider, Paper, TextField, Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import EditIcon from '@mui/icons-material/Edit';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PersonIcon from '@mui/icons-material/Person';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PaymentsIcon from '@mui/icons-material/Payments';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import {
    fetchAllSalesOrders,
    createSalesOrder,
    fetchAvailableClients,
    fetchAvailableVehicles,
    CreateOrderRequest,
    fetchCurrentUserStats
} from '@/api/salon.api';
import {createSaleInvoice, getSalesOrderInvoiceBytes} from "@/api/invoice.api.ts";
import {openPdfInNewTab} from "@/utils/pdfUtils.ts";
import {InvoiceSaleRequest} from "@/types/invoice.type.ts";

export default function SalesOrdersPage() {
    const queryClient = useQueryClient();

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [sortBy, setSortBy] = useState<string>('DATE_DESC');

    const [selectedClientId, setSelectedClientId] = useState<number | ''>('');
    const [orderItems, setOrderItems] = useState<{ vehicleId: number; price: number }[]>([]);
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [editDraft, setEditDraft] = useState<{ vehicleId: number | '' }>({ vehicleId: '' });

    const { data: orders = [], isLoading: isOrdersLoading } = useQuery({
        queryKey: ['allSalesOrders'],
        queryFn: fetchAllSalesOrders
    });

    const { data: clients = [] } = useQuery({
        queryKey: ['availableClients'],
        queryFn: fetchAvailableClients
    });

    const { data: userStats = [] } = useQuery({
        queryKey: ['currentUserStats'],
        queryFn: fetchCurrentUserStats
    });

    const employeeLocationId = userStats.length > 0 ? userStats[0].location?.id : undefined;

    const { data: vehicles = [] } = useQuery({
        queryKey: ['availableVehicles', employeeLocationId],
        queryFn: () => fetchAvailableVehicles(employeeLocationId as number),
        enabled: !!employeeLocationId,
        refetchInterval: 30000
    });

    const sortedOrders = useMemo(() => {
        return [...orders].sort((a: any, b: any) => {
            const dateA = a.saleDate ? dayjs(a.saleDate).valueOf() : 0;
            const dateB = b.saleDate ? dayjs(b.saleDate).valueOf() : 0;
            const priceA = a.finalPrice || 0;
            const priceB = b.finalPrice || 0;

            switch (sortBy) {
                case 'DATE_DESC': return dateB - dateA;
                case 'DATE_ASC': return dateA - dateB;
                case 'PRICE_DESC': return priceB - priceA;
                case 'PRICE_ASC': return priceA - priceB;
                default: return 0;
            }
        });
    }, [orders, sortBy]);

    const createOrderMutation = useMutation({
        mutationFn: (newOrder: CreateOrderRequest) => createSalesOrder(newOrder),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['allSalesOrders'] });
            queryClient.invalidateQueries({ queryKey: ['availableVehicles'] });
            handleCloseCreateModal();
            alert("Zamówienie zostało pomyślnie wygenerowane!");
        },
        onError: (error: any) => {
            alert(error.response?.data || "Wystąpił błąd podczas tworzenia zamówienia.");
        }
    });

    const currentTotal = useMemo(() => orderItems.reduce((sum, item) => sum + (Number(item.price) || 0), 0), [orderItems]);

    const handleCloseCreateModal = () => {
        setIsCreateModalOpen(false);
        setSelectedClientId('');
        setOrderItems([]);
        setEditIndex(null);
    };

    const handleStartAdd = () => { setEditIndex(-1); setEditDraft({ vehicleId: '' }); };
    const handleStartEdit = (index: number) => { setEditIndex(index); setEditDraft({ vehicleId: orderItems[index].vehicleId }); };
    const handleCancelEdit = () => setEditIndex(null);

    const handleSaveEdit = () => {
        if (!editDraft.vehicleId) return;
        if (orderItems.some((item, idx) => item.vehicleId === editDraft.vehicleId && idx !== editIndex)) {
            alert("Ten pojazd znajduje się już na liście zamówienia!");
            return;
        }

        const selectedVehicle = vehicles.find((v: any) => v.id === editDraft.vehicleId);
        const autoPrice = selectedVehicle ? (selectedVehicle.marginPrice || 0) : 0;

        let newItems = [...orderItems];
        if (editIndex === -1) newItems.push({ vehicleId: editDraft.vehicleId as number, price: autoPrice });
        else if (editIndex !== null) newItems[editIndex] = { vehicleId: editDraft.vehicleId as number, price: autoPrice };

        setOrderItems(newItems);
        setEditIndex(null);
    };

    const handleDelete = (index: number) => setOrderItems(orderItems.filter((_, i) => i !== index));

    const handleCreateSubmit = () => {
        if (!selectedClientId) return alert("Proszę wybrać klienta.");
        if (orderItems.length === 0) return alert("Proszę dodać co najmniej jeden pojazd i zatwierdzić go ptaszkiem.");
        if (editIndex !== null) return alert("Zatwierdź lub anuluj edycję aktualnego pojazdu przed wygenerowaniem zamówienia.");

        const payload: CreateOrderRequest = {
            clientId: Number(selectedClientId),
            vehiclesIds: orderItems.map(item => item.vehicleId),
            saleDate: dayjs().format('YYYY-MM-DDTHH:mm:ss')
        };
        createOrderMutation.mutate(payload);
    };

    const handleGenerateInvoice = async () => {
        console.log(selectedOrder);
        const request: InvoiceSaleRequest = {
            id: "FFD/"
                + selectedOrder.id
                + "/"
                + dayjs().format('DD/MM/YY'),
            clientId: selectedOrder.client.id,
            saleOrderId: selectedOrder.id,
            dueDate: dayjs().add(30, "days").format('YYYY-MM-DDTHH:mm:ss')
        };
        console.log("REQUEST", request);
        const invoice = await createSaleInvoice(request)
        console.log("INVOICE", invoice);
        const blob = await getSalesOrderInvoiceBytes(invoice.id)
        openPdfInNewTab(blob)
    }

    const renderEditRow = () => {
        const selectedV = vehicles.find((v: any) => v.id === editDraft.vehicleId);
        const currentPrice = selectedV ? (selectedV.marginPrice || 0) : 0;

        return (
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: editIndex === -1 ? 1 : 0 }}>
                <FormControl sx={{ flex: 2 }} size="small">
                    <InputLabel>Wybierz Pojazd</InputLabel>
                    <Select
                        value={editDraft.vehicleId} label="Wybierz Pojazd"
                        onChange={(e) => setEditDraft({ vehicleId: e.target.value as number })}
                    >
                        {vehicles
                            .filter((v: any) => v.status === 'AVAILABLE' && v.active === true)
                            .map((v: any) => (
                                <MenuItem key={v.id} value={v.id}>
                                    {v.model} (VIN: {v.vin})
                                </MenuItem>
                            ))}
                    </Select>
                </FormControl>
                <TextField
                    size="small" label="Cena z marżą (PLN)" type="number"
                    value={currentPrice.toFixed(2)} sx={{ flex: 1 }} disabled
                />
                <IconButton color="success" onClick={handleSaveEdit} disabled={!editDraft.vehicleId}><CheckIcon /></IconButton>
                <IconButton color="error" onClick={handleCancelEdit}><CloseIcon /></IconButton>
            </Box>
        );
    };

    if (isOrdersLoading) return <Typography sx={{ p: 4 }}>Ładowanie systemu sprzedażowego...</Typography>;

    return (
        <Box sx={{ maxWidth: 1200, mx: 'auto', mt: 4, px: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Zarządzaj zamówieniami salonu</Typography>

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                    <FormControl sx={{ minWidth: 220 }} size="small">
                        <InputLabel>Sortuj zamówienia</InputLabel>
                        <Select value={sortBy} label="Sortuj zamówienia" onChange={(e) => setSortBy(e.target.value)}>
                            <MenuItem value="DATE_DESC">Od najnowszych (Data)</MenuItem>
                            <MenuItem value="DATE_ASC">Od najstarszych (Data)</MenuItem>
                            <MenuItem value="PRICE_DESC">Od najdroższych (Kwota)</MenuItem>
                            <MenuItem value="PRICE_ASC">Od najtańszych (Kwota)</MenuItem>
                        </Select>
                    </FormControl>

                    <Button
                        variant="contained" color="primary" startIcon={<AddIcon />} size="large"
                        onClick={() => setIsCreateModalOpen(true)}
                    >
                        Nowe zamówienie
                    </Button>
                </Box>
            </Box>

            <Grid container spacing={3}>
                {sortedOrders.length === 0 && (
                    <Grid size={{ xs: 12 }}><Typography sx={{ textAlign: 'center', color: 'text.secondary', mt: 4 }}>Brak zamówień w systemie.</Typography></Grid>
                )}
                {sortedOrders.map((order: any) => {
                    const formattedDate = order.saleDate ? dayjs(order.saleDate).format('DD.MM.YYYY, HH:mm') : 'Brak daty';

                    return (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={order.id}>
                            <Card elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                        <Typography variant="h6">#{order.id}</Typography>
                                        <Chip label="Zrealizowane" color="success" size="small" />
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                        <CalendarMonthIcon fontSize="small" color="action" />
                                        <Typography variant="body2">{formattedDate}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                        <PersonIcon fontSize="small" color="action" />
                                        <Typography variant="body2"><strong>Klient:</strong> {order.client?.firstName} {order.client?.lastName}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                                        <ReceiptIcon fontSize="small" color="primary" />
                                        <Typography variant="subtitle1" color="primary.main" sx={{ fontWeight: 'bold' }}>
                                            {order.finalPrice?.toFixed(2)} PLN
                                        </Typography>
                                    </Box>
                                </CardContent>
                                <CardActions>
                                    <Button fullWidth variant="outlined" onClick={() => setSelectedOrder(order)}>
                                        Szczegóły
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>

            <Dialog open={!!selectedOrder} onClose={() => setSelectedOrder(null)} maxWidth="sm" fullWidth>
                {selectedOrder && (
                    <>
                        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 'bold' }}>
                            Szczegóły zamówienia #{selectedOrder.id}
                            <IconButton onClick={() => setSelectedOrder(null)} size="small"><CloseIcon /></IconButton>
                        </DialogTitle>
                        <Divider />
                        <DialogContent>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <PersonIcon color="action" />
                                    <Typography>
                                        <strong>Klient:</strong> {selectedOrder.client?.firstName} {selectedOrder.client?.lastName} (Tel: {selectedOrder.client?.phone})
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <CalendarMonthIcon color="action" />
                                    <Typography>
                                        <strong>Data transakcji:</strong> {dayjs(selectedOrder.saleDate).format('DD.MM.YYYY, HH:mm')}
                                    </Typography>
                                </Box>

                                <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2, mb: 1 }}>
                                    Zakupione pojazdy:
                                </Typography>

                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    {(!selectedOrder.items || selectedOrder.items.length === 0) && (
                                        <Typography variant="body2" color="error">Brak danych o pojazdach (sprawdź @JsonIgnore w backendzie).</Typography>
                                    )}
                                    {selectedOrder.items?.map((item: any, idx: number) => (
                                        <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5, bgcolor: 'grey.50', border: '1px solid #eee', borderRadius: 1 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <DirectionsCarIcon color="primary" fontSize="small" />
                                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                    {item.vehicle?.model}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    (VIN: {item.vehicle?.vin})
                                                </Typography>
                                            </Box>
                                            <Typography sx={{ fontWeight: 'bold' }}>{item.price?.toFixed(2)} PLN</Typography>
                                        </Box>
                                    ))}
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2, p: 2, bgcolor: 'primary.light', borderRadius: 1, color: 'primary.contrastText' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <PaymentsIcon />
                                        <Typography variant="h6">Razem:</Typography>
                                    </Box>
                                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                        {selectedOrder.finalPrice?.toFixed(2)} PLN
                                    </Typography>
                                </Box>
                            </Box>
                        </DialogContent>
                        <DialogActions sx={{ p: 3, pt: 1 }}>
                            <Button
                                fullWidth variant="contained" color="secondary" size="large"
                                onClick={handleGenerateInvoice}
                            >
                                Generuj fakturę
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>

            <Dialog open={isCreateModalOpen} onClose={handleCloseCreateModal} maxWidth="md" fullWidth>
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 'bold' }}>
                    Kreator zamówienia
                    <IconButton onClick={handleCloseCreateModal} size="small"><CloseIcon /></IconButton>
                </DialogTitle>
                <Divider />

                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>1. Wybierz klienta</Typography>
                        <FormControl fullWidth size="small">
                            <InputLabel>Klient kupujący</InputLabel>
                            <Select
                                value={selectedClientId} label="Klient kupujący"
                                onChange={(e) => setSelectedClientId(e.target.value as number)}
                            >
                                {clients
                                    .filter((client: any) => client.active === true)
                                    .map((client: any) => (
                                    <MenuItem key={client.id} value={client.id}>
                                        {client.firstName} {client.lastName} (Tel: {client.phone})
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>

                    <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>2. Wybrane pojazdy</Typography>
                        </Box>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            {orderItems.length === 0 && editIndex !== -1 && (
                                <Alert severity="info" sx={{ mb: 1 }}>Zamówienie jest puste. Dodaj pojazd, aby kontynuować.</Alert>
                            )}

                            {orderItems.map((item, index) => {
                                if (editIndex === index) {
                                    return <Box key={index}>{renderEditRow()}</Box>;
                                }

                                const vDetails = vehicles.find((v: any) => v.id === item.vehicleId);
                                return (
                                    <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, bgcolor: 'grey.100', borderRadius: 1 }}>
                                        <Typography sx={{ flex: 2 }}>{vDetails ? `${vDetails.model} (VIN: ${vDetails.vin})` : 'Nieznany pojazd'}</Typography>
                                        <Typography sx={{ flex: 1, fontWeight: 'bold' }}>{item.price.toFixed(2)} PLN</Typography>
                                        <Box>
                                            <IconButton size="small" color="primary" onClick={() => handleStartEdit(index)} disabled={editIndex !== null}><EditIcon fontSize="small" /></IconButton>
                                            <IconButton size="small" color="error" onClick={() => handleDelete(index)} disabled={editIndex !== null}><DeleteIcon fontSize="small" /></IconButton>
                                        </Box>
                                    </Box>
                                );
                            })}

                            {editIndex === -1 && renderEditRow()}

                            {editIndex === null && (
                                <Button startIcon={<AddIcon />} onClick={handleStartAdd} sx={{ alignSelf: 'flex-start', mt: 1 }}>
                                    Dodaj pojazd do zamówienia
                                </Button>
                            )}
                        </Box>
                    </Box>

                    <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6">Wartość zamówienia:</Typography>
                        <Typography variant="h5" color="primary.main" sx={{ fontWeight: 'bold' }}>
                            {currentTotal.toFixed(2)} PLN
                        </Typography>
                    </Paper>

                </DialogContent>

                <DialogActions sx={{ p: 3, pt: 0 }}>
                    <Button onClick={handleCloseCreateModal} size="large">Anuluj</Button>
                    <Button
                        variant="contained" color="success" size="large"
                        onClick={handleCreateSubmit}
                        disabled={createOrderMutation.isPending || editIndex !== null}
                    >
                        Zatwierdź i generuj zamówienie
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}