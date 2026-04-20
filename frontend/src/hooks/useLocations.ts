import { useQuery } from '@tanstack/react-query';
import { locationsApi } from '@/api/location.api';

export const useLocations = () =>
    useQuery({
        queryKey: ['locations'],
        queryFn: locationsApi.getAll,
    });