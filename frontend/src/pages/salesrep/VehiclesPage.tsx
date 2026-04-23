import {useState} from 'react'
import {Box, Button, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, CircularProgress, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useGetVehicles, useDeleteVehicle } from '../../hooks/useVehicles';
import { AddVehicleDialog } from '../../components/vehicles/AddVehicleDialog';

export default function VehiclesPage() {
    const locationId = 1;
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const {data:vehicles, isLoading, isError} = useGetVehicles(locationId);
    const {mutate: deleteVehicle} = useDeleteVehicle(locationId);

    const handleDelete = (id: number) => {
        if (window.confirm('Czy na pewno chcesz usunąć ten pojazd?')) {
            deleteVehicle(id);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Zarządzanie Flotą</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setIsDialogOpen(true)}>
                    Dodaj Pojazd
                </Button>
            </Box>

            {isLoading ? <CircularProgress /> : isError ? <Typography color="error">Błąd API</Typography> : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                            <TableRow>
                                <TableCell><b>ID</b></TableCell>
                                <TableCell><b>Model</b></TableCell>
                                <TableCell><b>VIN</b></TableCell>
                                <TableCell><b>Cena</b></TableCell>
                                <TableCell><b>Status</b></TableCell>
                                <TableCell align="right"><b>Akcje</b></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {vehicles?.map((vehicle) => (
                                <TableRow key={vehicle.id} hover>
                                    <TableCell>{vehicle.id}</TableCell>
                                    <TableCell>{vehicle.model}</TableCell>
                                    <TableCell>{vehicle.vin}</TableCell>
                                    <TableCell>{vehicle.marginPrice.toLocaleString('pl-PL')} zł</TableCell>
                                    <TableCell>
                                        <Chip label={vehicle.status} size="small" color={vehicle.status === 'AVAILABLE' ? 'success' : 'default'} />
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton color="error" onClick={() => handleDelete(vehicle.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <AddVehicleDialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} locationId={locationId} />
        </Box>
    );
}