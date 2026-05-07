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