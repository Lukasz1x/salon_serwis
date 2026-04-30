import { useState } from 'react';
import { Box, Typography, TextField, MenuItem, CircularProgress,
    Card, CardContent, Chip, Divider, Grid, Tooltip } from '@mui/material';
import { VehicleGallery } from "../../components/vehicles/VehicleGallery.tsx";
import { useGetVehicles } from '../../hooks/useVehicles';
import { useLocations } from "../../hooks/useLocations.ts";
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

export default function OfferPage() {
    const [locationId, setLocationId] = useState<number>(0);

    const { data: locations, isLoading: isLocationsLoading } = useLocations();

    const activeLocations = locations?.filter(location => location.active && location.locationType !== "SERVICE") || [];

    const currentLocationId = locationId !== 0
        ? locationId
        : (activeLocations.length > 0 ? activeLocations[0].id : 0);

    const { data: vehicles, isLoading, isError } = useGetVehicles(currentLocationId);

    return (
        <Box sx={{ p: 3 }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Auta dostępne od ręki</Typography>

    {/* WYBÓR LOKALIZACJI */}
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
    <TextField
        select
    size="small"
    label="Lokalizacja"
    value={currentLocationId}
    onChange={(e) => setLocationId(Number(e.target.value))}
    sx={{ minWidth: 200 }}
    disabled={isLocationsLoading || activeLocations.length === 0}
>
    {activeLocations.map((loc) => (
        <MenuItem key={loc.id} value={loc.id}>
        {loc.name}
        </MenuItem>
    ))}
    </TextField>
    </Box>
    </Box>

    {isLoading ? <CircularProgress /> : isError ? <Typography color="error">Błąd API</Typography> : (
        <Grid container spacing={4}>
            {vehicles?.slice().sort((a, b) => a.id - b.id).map((vehicle) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={vehicle.id}>
                    <Card sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 }
                    }}>

                        {/* GALERIA */}
                        <VehicleGallery model={vehicle.model} />

                        {/* INFORMACJE */}
                        <CardContent sx={{ flexGrow: 1 }}>
                            <Typography variant="h5" gutterBottom sx={{fontWeight: 'bold'}}>
                                {vehicle.model}
                            </Typography>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <DirectionsCarIcon fontSize="small" color="action" />
                                <Typography variant="body2" color="text.secondary">
                                    {vehicle.engineSpec || 'Silnik - brak danych'}
                                </Typography>
                            </Box>

                            <Divider sx={{ my: 1.5 }} />

                            {/* WYPOSAŻENIE */}
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                                {vehicle.equipment && Object.keys(vehicle.equipment).length > 0 ? (
                                    Object.entries(vehicle.equipment).slice(0, 4).map(([key, value]) => ( // Ograniczamy do 4 cech, by karta nie rosła w nieskończoność
                                        <Chip key={key} label={`${key}: ${value}`} size="small" variant="outlined" />
                                    ))
                                ) : (
                                    <Typography variant="caption" color="text.secondary">Wyposażenie podstawowe</Typography>
                                )}
                                {vehicle.equipment && Object.keys(vehicle.equipment).length > 4 && (
                                    <Tooltip
                                        arrow
                                        placement="top"
                                        title={
                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, p: 0.5 }}>
                                                {Object.entries(vehicle.equipment)
                                                    .slice(4) // Bierzemy wszystko od 5-go elementu wzwyż
                                                    .map(([key, value]) => (
                                                        <Typography key={key} variant="caption" sx={{ display: 'block' }}>
                                                            • <b>{key}</b>: {value}
                                                        </Typography>
                                                    ))}
                                            </Box>
                                        }
                                    >
                                        <Chip
                                            label={`+${Object.keys(vehicle.equipment).length - 4} więcej`}
                                            size="small"
                                            sx={{ cursor: 'pointer', backgroundColor: '#e0e0e0', '&:hover': { backgroundColor: '#d5d5d5' } }}
                                        />
                                    </Tooltip>
                                )}
                            </Box>

                            {/* CENA */}
                            <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
                                <LocalOfferIcon color="primary" />
                                <Typography variant="h6" color="primary" sx={{fontWeight: 'bold'}}>
                                    {vehicle.marginPrice.toLocaleString('pl-PL')} zł
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    )}
    </Box>
);
}