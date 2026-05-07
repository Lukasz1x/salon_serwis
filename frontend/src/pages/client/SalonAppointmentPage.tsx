import { Container, Typography, Paper } from '@mui/material';
import SalonForm from '@/components/client/SalonForm';

export default function SalonAppointmentPage() {
    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom align="center">
                Umów wizytę w Salonie
            </Typography>
            <Paper elevation={3} sx={{ p: 4, bgcolor: 'background.default' }}>
                <SalonForm />
            </Paper>
        </Container>
    );
}