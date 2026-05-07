export enum SalonAppointmentType {
  VIEWING = 'VIEWING',
  TEST_DRIVE = 'TEST_DRIVE',
  PURCHASE = 'PURCHASE',
  CONSULTATION = 'CONSULTATION'
}

export enum ServiceType {
  INSPECTION = 'INSPECTION',
  REPAIR = 'REPAIR',
  TIRE_CHANGE = 'TIRE_CHANGE',
  OIL_SERVICE = 'OIL_SERVICE',
  FILTER_CHANGE = 'FILTER_CHANGE'
}

export interface ServiceAppointmentRequest {
    vehicleId: number;
    locationId: number;
    type: string;
    issueDescription: string;
    appointmentDate: string;
}

export interface SalonAppointmentRequest {
    employeeId: number;
    locationId: number;
    vehicleId?: number | null;
    type: string;
    appointmentDate: string;
    notes?: string;
}