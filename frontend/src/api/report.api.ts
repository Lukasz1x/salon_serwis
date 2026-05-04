import {apiClient} from './AxiosClient.ts';
import {SalonReport, ServiceReport} from '../types/report.types.ts';

export const fetchSalonReport = async (begin: string, end: string): Promise<SalonReport> => {
    const {data} = await apiClient.get(`/salonReport/get/beginDate=${begin}&endDate=${end}`);
    return typeof data === 'string' ? JSON.parse(data) : data;
}

export const fetchServiceReport = async (begin: string, end: string): Promise<ServiceReport> => {
    const {data} = await apiClient.get(`/serviceReport/get/beginDate=${begin}&endDate=${end}`);
    return typeof data === 'string' ? JSON.parse(data) : data;
}