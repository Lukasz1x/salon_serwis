import { useState } from 'react';
import { Box, Card, CardContent, Grid, Typography, TextField, CircularProgress, Paper } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import dayjs from 'dayjs';
import { useSalonReport, useServiceReport } from '../../hooks/useReports';

export default function ReportsPage(){
    const [startDateStr, setStartDateStr] = useState(dayjs().subtract(30, 'day').format('YYYY-MM-DDTHH:mm'));
    const [endDateStr, setEndDateStr] = useState(dayjs().format('YYYY-MM-DDTHH:mm'));
    const apiStartDate = `${startDateStr}:00`;
    const apiEndDate = `${endDateStr}:00`;

    const { data: salonData, isLoading: isLoadingSalon } = useSalonReport(apiStartDate, apiEndDate);
    const { data: serviceData, isLoading: isLoadingService } = useServiceReport(apiStartDate, apiEndDate);

    const serviceChartData = serviceData ? [
        {
            name: 'Statusy Zleceń',
            Zaplanowane: serviceData.scheduledRepairOrders,
            Zakończone: serviceData.completedRepairOrders,
            Anulowane: serviceData.canceledRepairOrders,
        }
    ] : [];

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>Raporty</Typography>

            {/* FILTRY DATY */}
            <Paper sx={{ p: 2, mb: 4, display: 'flex', gap: 2, alignItems: 'center' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Zakres analizy:</Typography>
                <TextField
                    type="datetime-local"
                    size="small"
                    value={startDateStr}
                    onChange={(e) => setStartDateStr(e.target.value)}
                />
                <Typography>-</Typography>
                <TextField
                    type="datetime-local"
                    size="small"
                    value={endDateStr}
                    onChange={(e) => setEndDateStr(e.target.value)}
                />
            </Paper>

            {/* RAPORT SALONU */}
            <Typography variant="h6" sx={{ mb: 2 }}>Wyniki Sprzedażowe (Salon)</Typography>
            {isLoadingSalon ? <CircularProgress sx={{ mb: 4 }} /> : salonData && (
                <Grid container spacing={3} sx={{ mb: 5 }}>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <Card elevation={2}>
                            <CardContent>
                                <Typography color="text.secondary" gutterBottom>Sprzedane Pojazdy</Typography>
                                <Typography variant="h3" color="primary">{salonData.countOfSalesOrders}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <Card elevation={2}>
                            <CardContent>
                                <Typography color="text.secondary" gutterBottom>Przychód ze sprzedaży</Typography>
                                <Typography variant="h3" color="success.main">
                                    {salonData.sumOfFinalPrices?.toLocaleString('pl-PL')} zł
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <Card elevation={2}>
                            <CardContent>
                                <Typography color="text.secondary" gutterBottom>Zarejestrowane Wizyty</Typography>
                                <Typography variant="h3" color="info.main">{salonData.salonAppointments?.length || 0}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {/* RAPORT SERWISU */}
            <Typography variant="h6" sx={{ mb: 2 }}>Zlecenia Naprawy (Serwis)</Typography>
            {isLoadingService ? <CircularProgress /> : serviceData && (
                <Paper elevation={2} sx={{ p: 3, height: 400 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={serviceChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="Zaplanowane" fill="#1976d2" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="Zakończone" fill="#2e7d32" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="Anulowane" fill="#d32f2f" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </Paper>
            )}
        </Box>
    );
};