import {useState} from 'react';
import {
    Box,
    Button,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    CircularProgress,
    IconButton,
    MenuItem,
    TextField,
    Tooltip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import {useGetVehicles, useDeleteVehicle} from '../../hooks/useVehicles';
import {AddVehicleDialog} from '../../components/vehicles/AddVehicleDialog';
import {EngineDialog} from '../../components/vehicles/EngineDialog';
import {EquipmentDialog} from '../../components/vehicles/EquipmentDialog';
import {useLocations} from "../../hooks/useLocations.ts";

export default function VehiclesPage() {
    const [locationId, setLocationId] = useState<number>(0);

    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [engineDialogData, setEngineDialogData] = useState<{
        open: boolean,
        vehicleId: number | null,
        engine?: string
    }>({open: false, vehicleId: null});

    const [equipmentDialogData, setEquipmentDialogData] = useState<{
        open: boolean,
        vehicleId: number | null
        equipment?: Record<string, string>
    }>({open: false, vehicleId: null});

    const {data: locations, isLoading: isLocationsLoading} = useLocations();

    const activeLocations = locations?.filter(location => location.active && location.locationType !== "SERVICE") || [];

    const currentLocationId = locationId !== 0
        ? locationId
        : (activeLocations.length > 0 ? activeLocations[0].id : 0);

    const {data: vehicles, isLoading, isError} = useGetVehicles(currentLocationId);
    const {mutate: deleteVehicle} = useDeleteVehicle(currentLocationId);

    const getVehicleImagePath = (model: string) => {
        if (!model)
            return `placeholder.png`;
        const safeName = model.toLowerCase().trim().replace(/\s+/g, '-');
        return `/vehicles/${safeName}-1.png`;
    }

    const handleDelete = (id: number) => {
        if (window.confirm('Czy na pewno chcesz usunąć ten pojazd?')) {
            deleteVehicle(id);
        }
    };

    return (
        <Box sx={{p: 3}}>
            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3}}>
                <Typography variant="h4" sx={{fontWeight: 'bold'}}>Zarządzanie flotą</Typography>

                {/* WYBÓR LOKALIZACJI */}
                <Box sx={{display: 'flex', gap: 2, alignItems: 'center'}}>
                    <TextField
                        select
                        size="small"
                        label="Lokalizacja"
                        value={currentLocationId}
                        onChange={(e) => setLocationId(Number(e.target.value))}
                        sx={{minWidth: 200}}
                        disabled={isLocationsLoading || activeLocations.length === 0}
                    >
                        {activeLocations.map((loc) => (
                            <MenuItem key={loc.id} value={loc.id}>
                                {loc.name}
                            </MenuItem>
                        ))}
                    </TextField>

                    <Button variant="contained" startIcon={<AddIcon/>} onClick={() => setIsAddDialogOpen(true)}>
                        Dodaj Pojazd
                    </Button>
                </Box>
            </Box>

            {isLoading ? <CircularProgress/> : isError ? <Typography color="error">Błąd API</Typography> : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead sx={{backgroundColor: '#f5f5f5'}}>
                            <TableRow>
                                <TableCell><b>ID</b></TableCell>
                                <TableCell><b>Model</b></TableCell>
                                <TableCell><b>Zdjęcie</b></TableCell>
                                <TableCell><b>Silnik</b></TableCell>
                                <TableCell><b>Wyposażenie</b></TableCell>
                                <TableCell><b>Cena katalogowa</b></TableCell>
                                <TableCell><b>Cena z marżą</b></TableCell>
                                <TableCell><b>Status</b></TableCell>
                                <TableCell align="right"><b>Akcje</b></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {vehicles?.slice().sort((a, b) => a.id - b.id).map((vehicle) => (
                                <TableRow key={vehicle.id} hover>
                                    <TableCell>{vehicle.id}</TableCell>
                                    <TableCell><b>{vehicle.model}</b></TableCell>
                                    <TableCell><img
                                        src={getVehicleImagePath(vehicle.model)}
                                        alt={`Zdjęcie modelu ${vehicle.model}`}
                                        style={{
                                            width: '100px',
                                            height: '60px',
                                            objectFit: 'cover',
                                            borderRadius: '4px',
                                            border: '1px solid #ddd',
                                        }}
                                        onError={(e) => {
                                            e.currentTarget.src = '/vehicles/placeholder.png';
                                        }}
                                    />
                                    </TableCell>
                                    <TableCell>
                                        {vehicle.engineSpec ? (
                                            <Chip label={vehicle.engineSpec} size="small" variant="outlined"/>
                                        ) : (
                                            <Typography variant="caption" color="text.secondary">Brak
                                                danych</Typography>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {vehicle.equipment && Object.keys(vehicle.equipment).length > 0 ? (
                                            <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 0.5}}>
                                                {Object.entries(vehicle.equipment).map(([key, value]) => (
                                                    <Chip
                                                        key={key}
                                                        label={`${key}: ${value}`}
                                                        size="small"
                                                        variant="outlined"
                                                    />
                                                ))}
                                            </Box>
                                        ) : (
                                            <Typography variant="caption" color="text.secondary">Wyposażenie
                                                podstawowe</Typography>
                                        )}
                                    </TableCell>
                                    <TableCell sx={{whiteSpace: 'nowrap'}}>{vehicle.cataloguePrice.toLocaleString('pl-PL')} zł</TableCell>
                                    <TableCell sx={{whiteSpace: 'nowrap'}}>{vehicle.marginPrice.toLocaleString('pl-PL')} zł</TableCell>
                                    <TableCell>
                                        <Chip label={vehicle.status} size="small"
                                              color={vehicle.status === 'AVAILABLE' ? 'success' : 'default'}/>
                                    </TableCell>
                                    <TableCell align="right" sx={{whiteSpace: 'nowrap', minWidth: '160px'}}>
                                        <Box sx={{
                                            display: 'flex',
                                            justifyContent: 'flex-end',
                                            flexWrap: 'nowrap',
                                            gap: 1
                                        }}>

                                            <Tooltip title="Dodaj Silnik">
                                                <IconButton
                                                    color="primary"
                                                    onClick={() => setEngineDialogData({
                                                        open: true,
                                                        vehicleId: vehicle.id,
                                                        engine: vehicle.engineSpec
                                                    })}>
                                                    <SettingsSuggestIcon/>
                                                </IconButton>
                                            </Tooltip>

                                            <Tooltip title="Zarządzaj Wyposażeniem">
                                                <IconButton color="secondary" onClick={() => setEquipmentDialogData({
                                                    open: true,
                                                    vehicleId: vehicle.id,
                                                    equipment: vehicle.equipment
                                                })}>
                                                    <DirectionsCarIcon/>
                                                </IconButton>
                                            </Tooltip>

                                            <Tooltip title="Usuń Pojazd">
                                                <IconButton color="error" onClick={() => handleDelete(vehicle.id)}>
                                                    <DeleteIcon/>
                                                </IconButton>
                                            </Tooltip>

                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {vehicles?.length === 0 && (
                                <TableRow><TableCell colSpan={9} align="center">Brak pojazdów w tej
                                    lokalizacji.</TableCell></TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* MODALE */}
            <AddVehicleDialog
                open={isAddDialogOpen}
                onClose={() => setIsAddDialogOpen(false)}
                locationId={currentLocationId}
            />

            <EngineDialog
                open={engineDialogData.open}
                onClose={() => setEngineDialogData({open: false, vehicleId: null})}
                vehicleId={engineDialogData.vehicleId}
                locationId={currentLocationId}
                initialEngine={engineDialogData.engine}
            />

            <EquipmentDialog
                open={equipmentDialogData.open}
                onClose={() => setEquipmentDialogData({open: false, vehicleId: null})}
                vehicleId={equipmentDialogData.vehicleId}
                locationId={currentLocationId}
                initialEquipment={equipmentDialogData.equipment}
            />
        </Box>
    );
}