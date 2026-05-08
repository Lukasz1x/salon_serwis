import {apiClient} from './AxiosClient.ts';

export const fetchAllServiceAppointments = async () => {
    const { data } = await apiClient.get('/serviceAppointments/all');
    return data;
};

export const changeServiceAppointmentStatus = async (id: number, status: string) => {
    const { data } = await apiClient.put(`/serviceAppointments/changeStatus=${status}&appointmentId=${id}`);
    return data;
};

export const fetchAllRepairOrders = async () => {
    const { data } = await apiClient.get('/repairOrder/all');
    return data;
};

export const generateRepairOrder = async (appointmentId: number) => {
    const { data } = await apiClient.post('/repairOrder/generate', { appointmentId });
    return data;
};

export const addWorkDescription = async (repairOrderId: number, description: Record<string, number>) => {
    const { data } = await apiClient.put(`/repairOrder/addDescription&repairId=${repairOrderId}`, description);
    return data;
};

export const addFinalDate = async (repairOrderId: number, dateString: string) => {
    const { data } = await apiClient.put(`/repairOrder/addFinalDate=${dateString}&repairId=${repairOrderId}`);
    return data;
};

export const fetchRepairOrderForAppointment = async (appointmentId: number) => {
    const { data } = await apiClient.get(`/repairOrder/appointment/${appointmentId}`);
    return data;
};
