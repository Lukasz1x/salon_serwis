import { useState } from 'react';
import { Box, Card, CardContent, Grid, Typography, TextField, CircularProgress, Paper } from '@mui/material';
import { PieChart, Pie, Tooltip, ResponsiveContainer } from 'recharts';
import dayjs from 'dayjs';
import { useSalonReport, useServiceReport } from '../../hooks/useReports';

export default function ReportsPage(){
    const [startDateStr, setStartDateStr] = useState(dayjs().subtract(30, 'day').format('YYYY-MM-DDTHH:mm'));
    const [endDateStr, setEndDateStr] = useState(dayjs().format('YYYY-MM-DDTHH:mm'));
    const apiStartDate = `${startDateStr}:00`;
    const apiEndDate = `${endDateStr}:00`;

    const { data: salonData, isLoading: isLoadingSalon, isError: isErrorSalon, error: errorSalon } = useSalonReport(apiStartDate, apiEndDate);
    const { data: serviceData, isLoading: isLoadingService } = useServiceReport(apiStartDate, apiEndDate);


    const serviceChartData = serviceData ? [
        { name: 'Zaplanowane', value: serviceData.scheduledRepairOrders, fill: '#1976d2' },
        { name: 'Zakończone', value: serviceData.completedRepairOrders, fill: '#2e7d32' },
        { name: 'Anulowane', value: serviceData.canceledRepairOrders, fill: '#d32f2f' },
    ] : [];

    const hasAnyServiceData = serviceChartData.some(item => item.value > 0);

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
            {isErrorSalon && <Typography color="error" sx={{ mb: 4 }}>Błąd pobierania z backendu: {errorSalon?.message}</Typography>}
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
                <Paper elevation={2} sx={{ p: 3, height: 400, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {hasAnyServiceData ? (
                        <ResponsiveContainer width="100%" height="100%" style={{ fontFamily: 'Roboto, Helvetica, Arial, sans-serif' }}>
                            <PieChart>
                                <Pie
                                    data={serviceChartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={130}
                                    paddingAngle={5}
                                    dataKey="value"
                                    label={({ name, value }) => value > 0 ? `${name}: ${value}` : ''}
                                />

                                <Tooltip
                                    contentStyle={{
                                        borderRadius: '8px',
                                        border: 'none',
                                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <Typography variant="h6" color="text.secondary">
                            Brak zleceń serwisowych w wybranym okresie.
                        </Typography>
                    )}
                </Paper>
            )}
        </Box>
    );
};