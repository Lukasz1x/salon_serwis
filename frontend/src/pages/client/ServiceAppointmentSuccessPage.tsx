import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { Container, Typography, Paper, Box, Button, Divider, List, ListItem, ListItemText } from '@mui/material';
import { ServiceType } from '@/types/appointment.types';

const translateServiceType = (type: ServiceType) => {
    switch (type) {
        case ServiceType.INSPECTION: return 'Przegląd';
        case ServiceType.REPAIR: return 'Naprawa bieżąca';
        case ServiceType.TIRE_CHANGE: return 'Wymiana opon';
        case ServiceType.OIL_SERVICE: return 'Serwis olejowy';
        case ServiceType.FILTER_CHANGE: return 'Wymiana filtrów';
        default: return type;
    }
};

export default function ServiceAppointmentSuccessPage() {
    const location = useLocation();
    const navigate = useNavigate();

    const summaryData = location.state;

    if (!summaryData) {
        return <Navigate to="/home" replace />;
    }

    return (
        <Container maxWidth="sm" sx={{ mt: 8, mb: 4 }}>
            <Paper elevation={4} sx={{ p: 5, textAlign: 'center', borderRadius: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.main', mb: 2 }}>
                    Serwis zgłoszony!
                </Typography>
                <Typography sx={{ color: 'text.secondary', mb: 2 }}>
                    Przyjęliśmy Twoje zgłoszenie serwisowe. Poniżej znajduje się podsumowanie.
                </Typography>

                <Divider sx={{ my: 3 }} />

                <List disablePadding sx={{ textAlign: 'left' }}>
                    <ListItem>
                        <ListItemText
                            primary="Serwis"
                            secondary={`${summaryData.locationName} (${summaryData.locationCity})`}
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            primary="Przydzielony mechanik"
                            secondary={summaryData.employeeName}
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            primary="Pojazd"
                            secondary={summaryData.vehicleName}
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
                            primary="Rodzaj usługi"
                            secondary={translateServiceType(summaryData.type)}
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            primary="Krótki opis"
                            secondary={summaryData.issueDescription || 'Brak opisu'}
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