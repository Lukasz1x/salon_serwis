import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {fetchVehicles, createVehicle, removeVehicle, updateVehicleEngine, updateVehicleEquipment} from '../api/vehicle.api';
import {VehicleRequest} from '../types/vehicle.types';

export const useGetVehicles = (locationId: number) => {
    return useQuery({
        queryKey: ['vehicles', locationId],
        queryFn: () => fetchVehicles(locationId),
        enabled: !!locationId,
    });
};

export const useAddVehicle = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newVehicle: VehicleRequest) => createVehicle(newVehicle),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({queryKey: ['vehicles', variables.locationId]})
        },
    });
};

export const useDeleteVehicle = (locationId: number) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (vehicleId: number) => removeVehicle(vehicleId),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['vehicles', locationId]})
        },
    });
};

export const useUpdateEngine = (locationId: number) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({id, engine}: {id: number; engine: string}) => updateVehicleEngine(id, engine),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['vehicles', locationId]});
        },
    });
};

export const useUpdateEquipment = (locationId: number) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({id, equipment}: {id: number; equipment: Record<string, string>}) => updateVehicleEquipment(id, equipment),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vehicles', locationId]});
        },
    });
};