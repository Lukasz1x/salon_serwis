import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box } from '@mui/material';
import { useUpdateEngine } from '../../hooks/useVehicles';

interface EngineDialogProps {
    open: boolean;
    onClose: () => void;
    vehicleId: number | null;
    locationId: number;
    initialEngine?: string
}

export const EngineDialog = ({ open, onClose, vehicleId, locationId, initialEngine }: EngineDialogProps) => {
    const [engine, setEngine] = useState(initialEngine || '');

    const [prevVehicleId, setPrevVehicleID] = useState(vehicleId);

    if (vehicleId !== prevVehicleId) {
        setPrevVehicleID(vehicleId);
        setEngine(initialEngine || '');
    }

    const { mutate: updateEngine, isPending } = useUpdateEngine(locationId);

    const handleSave = () => {
        if (vehicleId && engine.trim() !== '') {
            updateEngine({ id: vehicleId, engine }, {
                onSuccess: () => {
                    setEngine('');
                    onClose();
                }
            });
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Podaj specyfikację silnika</DialogTitle>
            <DialogContent dividers>
                <Box sx={{ mt: 1 }}>
                    <TextField
                        label="Silnik (np. 2.0 TDI 150KM)"
                        fullWidth
                        value={engine}
                        onChange={(e) => setEngine(e.target.value)}
                        disabled={isPending}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="inherit">Anuluj</Button>
                <Button onClick={handleSave} variant="contained" disabled={isPending || !engine}>
                    {isPending ? 'Zapisywanie...' : 'Zapisz'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};