import apiClient from './AxiosClient';
import { Location } from '@/types/location.types';

export const locationsApi = {
    getAll: (): Promise<Location[]> =>
        apiClient.get<Location[]>('/location/all').then(r => r.data),
};