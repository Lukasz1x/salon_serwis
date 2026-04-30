import { useState } from 'react'; // <-- Usuwamy useEffect!
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, IconButton} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useUpdateEquipment } from '../../hooks/useVehicles';

interface EquipmentDialogProps {
    open: boolean;
    onClose: () => void;
    vehicleId: number | null;
    locationId: number;
    initialEquipment?: Record<string, string>;
}

export const EquipmentDialog = ({ open, onClose, vehicleId, locationId, initialEquipment }: EquipmentDialogProps) => {

    // 1. Pomocnicza funkcja: "Wyciągnij cechy z propa albo daj pustą linijkę"
    const getInitialItems = () => {
        if (initialEquipment && Object.keys(initialEquipment).length > 0) {
            return Object.entries(initialEquipment).map(([key, value]) => ({ key, value }));
        }
        return [{ key: '', value: '' }];
    };

    // 2. Ładujemy początkowy stan
    const [items, setItems] = useState(getInitialItems);

    // 3. Stan pomocniczy do śledzenia, dla jakiego auta obecnie otwarte jest okienko
    const [prevVehicleId, setPrevVehicleId] = useState(vehicleId);

    // 4. MAGIA REACTA: Aktualizacja w locie (zastępuje useEffect)
    // Jeśli ID auta się zmieniło (np. okienko otwarto dla innego pojazdu, albo je zamknięto)
    if (vehicleId !== prevVehicleId) {
        setPrevVehicleId(vehicleId); // Zapisujemy nowe ID
        setItems(getInitialItems()); // Resetujemy formularz natychmiast!
    }

    const { mutate: updateEquipment, isPending } = useUpdateEquipment(locationId);

    const handleAddRow = () => setItems([...items, { key: '', value: '' }]);
    const handleRemoveRow = (index: number) => setItems(items.filter((_, i) => i !== index));

    const handleChange = (index: number, field: 'key' | 'value', val: string) => {
        const newItems = [...items];
        newItems[index][field] = val;
        setItems(newItems);
    };

    const handleSave = () => {
        if (!vehicleId) return;

        const equipmentRecord: Record<string, string> = items.reduce((acc, curr) => {
            if (curr.key.trim() !== '') {
                acc[curr.key] = curr.value;
            }
            return acc;
        }, {} as Record<string, string>);

        updateEquipment({ id: vehicleId, equipment: equipmentRecord }, {
            onSuccess: () => {
                // Skoro zmiana vehicleId na null w komponencie wyżej i tak
                // wyresetuje nam formularz, wystarczy samo onClose()
                onClose();
            }
        });
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Zarządzaj Wyposażeniem</DialogTitle>
            <DialogContent dividers>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                    {items.map((item, index) => (
                        <Box key={index} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <TextField
                                label="Cecha (np. Lakier)"
                                size="small"
                                value={item.key}
                                onChange={(e) => handleChange(index, 'key', e.target.value)}
                                fullWidth
                            />
                            <TextField
                                label="Wartość (np. Metalik)"
                                size="small"
                                value={item.value}
                                onChange={(e) => handleChange(index, 'value', e.target.value)}
                                fullWidth
                            />
                            <IconButton color="error" onClick={() => handleRemoveRow(index)} disabled={items.length === 1}>
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                    ))}
                    <Button startIcon={<AddIcon />} onClick={handleAddRow} sx={{ alignSelf: 'flex-start' }}>
                        Dodaj kolejną cechę
                    </Button>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="inherit">Anuluj</Button>
                <Button onClick={handleSave} variant="contained" disabled={isPending}>
                    {isPending ? 'Zapisywanie...' : 'Zapisz'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};