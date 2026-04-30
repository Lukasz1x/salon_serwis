import { useState } from 'react';
import { Box, CardMedia, IconButton } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

interface VehicleGalleryProps {
    model: string;
}

export const VehicleGallery = ({ model }: VehicleGalleryProps) => {
    const [currentIndex, setCurrentIndex] = useState(1);
    const [imageError, setImageError] = useState(false);

    const [maxIndex, setMaxIndex] = useState<number | null>(null);

    const getImageUrl = (index: number) => {
        if (!model) return '/vehicles/placeholder.png';
        const safeName = model.toLowerCase().trim().replace(/\s+/g, '-');
        return `/vehicles/${safeName}-${index}.png`;
    };

    const handleNext = () => {
        if (maxIndex === null || currentIndex < maxIndex) {
            setCurrentIndex((prev) => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 1) {
            setCurrentIndex((prev) => prev - 1);
        }
    };

    const handleError = () => {
        if (currentIndex === 1) {
            setImageError(true);
        } else {
            setMaxIndex(currentIndex - 1);
            setCurrentIndex((prev) => prev - 1);
        }
    };

    return (
        <Box sx={{ position: 'relative', height: 220, backgroundColor: '#f5f5f5' }}>
            <CardMedia
                component="img"
                height="220"
                image={imageError ? '/vehicles/placeholder.png' : getImageUrl(currentIndex)}
                alt={`Zdjęcie ${model} - ${currentIndex}`}
                onError={handleError}
                sx={{ objectFit: 'cover' }}
            />

            {/* Przycisk WSTECZ */}
            {currentIndex > 1 && (
                <IconButton
                    onClick={handlePrev}
                    sx={{
                        position: 'absolute', top: '50%', left: 8, transform: 'translateY(-50%)',
                        backgroundColor: 'rgba(255, 255, 255, 0.7)', '&:hover': { backgroundColor: 'white' }
                    }}
                >
                    <ArrowBackIosNewIcon fontSize="small" />
                </IconButton>
            )}

            {/* Przycisk DALEJ */}
            {!imageError && (maxIndex === null || currentIndex < maxIndex) && (
                <IconButton
                    onClick={handleNext}
                    sx={{
                        position: 'absolute', top: '50%', right: 8, transform: 'translateY(-50%)',
                        backgroundColor: 'rgba(255, 255, 255, 0.7)', '&:hover': { backgroundColor: 'white' }
                    }}
                >
                    <ArrowForwardIosIcon fontSize="small" />
                </IconButton>
            )}
        </Box>
    );
};