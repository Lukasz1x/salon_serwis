import apiClient from './AxiosClient';
import {Location, LocationRequest} from '@/types/location.types';

export const locationsApi = {
    getAll: (): Promise<Location[]> =>
        apiClient.get<Location[]>('/location/all').then(r => r.data),

    delete: (id: number) =>
        apiClient.delete(`/location/${id}`),

    add: (location: LocationRequest) =>
        apiClient.post(`/location/add`, location).then(r => r.data),
};