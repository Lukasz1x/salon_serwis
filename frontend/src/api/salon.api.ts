import {apiClient} from './AxiosClient.ts';

export const fetchAllSalesOrders = async () => {
    const { data } = await apiClient.get('/salesOrder/all');
    return data;
};

export interface CreateOrderRequest {
    clientId: number;
    vehiclesIds: number[];
    saleDate: string;
}

export const createSalesOrder = async (orderData: CreateOrderRequest) => {
    const { data } = await apiClient.post('/salesOrder/generate', orderData);
    return data;
};

export const fetchAvailableClients = async () => {
    const { data } = await apiClient.get('/users/clients');
    return data;
};

export const fetchAvailableVehicles = async (locationId: number) => {
    const { data } = await apiClient.get(`/vehicles/location=${locationId}`);
    return data;
};

export const fetchCurrentUserStats = async () => {
    const { data } = await apiClient.get('/users/stats');
    return data;
};