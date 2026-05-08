import {apiClient} from './AxiosClient.ts';
import { SalonAppointmentRequest, ServiceAppointmentRequest } from '../types/appointment.types';

export const arrangeSalonAppointment = async (data: SalonAppointmentRequest) => {
  const response = await apiClient.post('/salonAppointments/arrange', data);
  return response.data;
};

export const arrangeServiceAppointment = async (data: ServiceAppointmentRequest) => {
  const response = await apiClient.post('/serviceAppointments/arrange', data);
  return response.data;
};

export const fetchBookedSalonAppointments = async (locationId: number, date: string) => {
  const { data } = await apiClient.get(`/salonAppointments/filter`, {
    params: { locationId, date }
  });
  return data;
};

export const fetchBookedServiceAppointments = async (locationId: number, date: string) => {
  const { data } = await apiClient.get(`/serviceAppointments/filter`, {
    params: { locationId, date }
  });
  return data;
};

export const fetchMySalonAppointments = async () => {
  const { data } = await apiClient.get('/salonAppointments/my');
  return data;
};

export const fetchMyServiceAppointments = async () => {
  const { data } = await apiClient.get('/serviceAppointments/my');
  return data;
};

export const cancelSalonAppointment = async (id: number) => {
  const { data } = await apiClient.put(`/salonAppointments/${id}/cancel`);
  return data;
};

export const cancelServiceAppointment = async (id: number) => {
  const { data } = await apiClient.put(`/serviceAppointments/${id}/cancel`);
  return data;
};