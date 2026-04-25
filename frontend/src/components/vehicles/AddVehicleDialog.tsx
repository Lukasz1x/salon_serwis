import {useForm} from 'react-hook-form';
import {Dialog, DialogTitle,DialogContent,DialogActions,Button,TextField, MenuItem,Box} from '@mui/material';
import {useAddVehicle} from '../../hooks/useVehicles'
import {VehicleRequest} from '../../types/vehicle.types';

interface AddVehicleDialogProps {
    open: boolean;
    onClose: () => void;
    locationId:number;
}

const VEHICLE_STATUSES = [  'AVAILABLE', 'RESERVED', 'SOLD', 'AWAITING_REPAIR', 'UNDER_REPAIR', 'CANCELLED_REPAIR', 'READY_FOR_PICKUP'];

export const AddVehicleDialog = ({open, onClose, locationId}: AddVehicleDialogProps) => {
    const {mutate:addVehicle, isPending} = useAddVehicle();
    const {register, handleSubmit, reset, formState: {errors}} = useForm<VehicleRequest>({
        defaultValues: {locationId, status: 'AVAILABLE'}
    });

    const onSubmit = (data: VehicleRequest) => {
    const formattedData = {
        ...data,
        productionYear: Number(data.productionYear),
        cataloguePrice: Number(data.cataloguePrice),
        marginPrice: Number(data.marginPrice),
        locationId: locationId,
    };

    addVehicle(formattedData, {
        onSuccess: () => {
            reset();
            onClose();
        }
    });
};

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Dodaj nowy pojazd</DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent dividers>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField label="Model" {...register('model', { required: true })} error={!!errors.model} fullWidth />
                        <TextField label="VIN" {...register('vin', { required: true })} error={!!errors.vin} fullWidth />
                        <TextField label="Rok produkcji" type="number" {...register('productionYear', { required: true })} fullWidth />
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField label="Cena katalogowa" type="number" {...register('cataloguePrice')} fullWidth />
                            <TextField label="Cena z marżą" type="number" {...register('marginPrice', { required: true })} fullWidth />
                        </Box>
                        <TextField select label="Status" defaultValue="AVAILABLE" {...register('status')} fullWidth>
                            {VEHICLE_STATUSES.map(status => (
                                <MenuItem key={status} value={status}>{status}</MenuItem>
                            ))}
                        </TextField>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="inherit">Anuluj</Button>
                    <Button type="submit" variant="contained" disabled={isPending}>
                        {isPending ? 'Zapisywanie...' : 'Zapisz Pojazd'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};
