import {apiClient} from './AxiosClient'
import {Vehicle, VehicleRequest} from '../types/vehicle.types'

export const fetchMyVehicles = async () => {
    const response = await apiClient.get('/vehicles/my');
    return response.data;
};

export const fetchVehicles = async (locationId: number) : Promise<Vehicle[]> => {
    const {data} = await apiClient.get(`/vehicles/location=${locationId}`);
    return data.filter((v: Vehicle) => v.active)
}

export const createVehicle = async (vehicle: VehicleRequest): Promise<Vehicle> => {
    const {data} = await apiClient.post('vehicles/add', vehicle);
    return data;
}

export const removeVehicle = async (vehicleId: number): Promise<void> => {
    await apiClient.delete(`vehicles/${vehicleId}`);
}

export const updateVehicleEngine = async (vehicleId: number, engine: string): Promise<Vehicle> => {
    const {data} = await apiClient.put(`/vehicles/engine=${vehicleId}`, engine, {
        headers: {'Content-Type': 'text/plain'}
    });
    return data;
};

export const updateVehicleEquipment = async (vehicleId: number, equipment: Record<string, string>): Promise<Vehicle> => {
    const {data} = await apiClient.put(`/vehicles/equipment=${vehicleId}`, equipment);
    return data;
};