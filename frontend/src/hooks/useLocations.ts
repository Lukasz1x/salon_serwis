import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import { locationsApi } from '@/api/location.api';
import {LocationRequest} from "@/types/location.types.ts";

export const useLocations = () =>
    useQuery({
        queryKey: ['locations'],
        queryFn: locationsApi.getAll,
    });

export const useDeleteLocation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => locationsApi.delete(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['locations'] }),
    })
}

export const useAddLocation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (location: LocationRequest) => locationsApi.add(location),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['locations']})
    })
}