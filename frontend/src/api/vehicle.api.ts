import {apiClient} from './AxiosClient'
import {Vehicle, VehicleRequest} from '../types/vehicle.types'

export const fetchVehicles = async (locationId: number) : Promise<Vehicle[]> => {
    const {data} = await apiClient.get(`/vehicles/location=${locationId}`);
    return data.filter((v: Vehicle) => v.isActive)
}

export const createVehicle = async (vehicle: VehicleRequest): Promise<Vehicle> => {
    const {data} = await apiClient.post('vehicles/add', vehicle);
    return data;
}

export const removeVehicle = async (vehicleId: number): Promise<void> => {
    await apiClient.delete(`vehicles/${vehicleId}`);
}