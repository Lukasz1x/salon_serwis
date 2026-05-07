import { Container, Typography, Paper } from '@mui/material';
import ServiceForm from '@/components/client/ServiceForm';

export default function ServiceAppointmentPage() {
    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" align="center" sx={{ fontWeight: 'bold', mb: 2 }}>
                Umów naprawę w Serwisie
            </Typography>
            <Paper elevation={3} sx={{ p: 4, bgcolor: 'background.default' }}>
                <ServiceForm />
            </Paper>
        </Container>
    );
}