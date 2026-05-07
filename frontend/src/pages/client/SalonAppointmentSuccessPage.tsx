import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { Container, Typography, Paper, Box, Button, Divider, List, ListItem, ListItemText } from '@mui/material';
import { SalonAppointmentType } from '@/types/appointment.types';

const translateType = (type: SalonAppointmentType) => {
    switch (type) {
        case SalonAppointmentType.CONSULTATION: return 'Konsultacja';
        case SalonAppointmentType.VIEWING: return 'Oględziny auta';
        case SalonAppointmentType.TEST_DRIVE: return 'Jazda próbna';
        case SalonAppointmentType.PURCHASE: return 'Zakup';
        default: return type;
    }
};

export default function SalonAppointmentSuccessPage() {
    const location = useLocation();
    const navigate = useNavigate();

    const summaryData = location.state;

    if (!summaryData) {
        return <Navigate to="/home" replace />;
    }

    return (
        <Container maxWidth="sm" sx={{ mt: 8, mb: 4 }}>
            <Paper elevation={4} sx={{ p: 5, textAlign: 'center', borderRadius: 3 }}>
                <Typography variant="h4" fontWeight="bold" color="success.main" gutterBottom>
                    Wizyta umówiona!
                </Typography>
                <Typography color="text.secondary" paragraph>
                    Dziękujemy za zaufanie. Poniżej znajduje się podsumowanie Twojego spotkania.
                </Typography>

                <Divider sx={{ my: 3 }} />

                <List disablePadding sx={{ textAlign: 'left' }}>
                    <ListItem>
                        <ListItemText
                            primary="Lokalizacja"
                            secondary={`${summaryData.locationName} (${summaryData.locationCity})`}
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            primary="Twój opiekun (Sprzedawca)"
                            secondary={summaryData.employeeName}
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            primary="Data i godzina"
                            secondary={summaryData.appointmentDate.replace('T', ' ')}
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            primary="Cel wizyty"
                            secondary={translateType(summaryData.type)}
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            primary="Wybrany pojazd"
                            secondary={summaryData.vehicleName}
                        />
                    </ListItem>
                </List>

                <Box sx={{ mt: 5 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        fullWidth
                        onClick={() => navigate('/home')}
                    >
                        Powrót do strony głównej
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
}