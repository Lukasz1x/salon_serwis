export interface ServiceAppointmentRequest {
    vehicleId: number;
    locationId: number;
    type: string;
    issueDescription: string;
    appointmentDate: string;
}

export interface ServiceAppointment {

}

export interface SalonAppointmentRequest {
    employeeId: number;
    locationId: number;
    vehicleId?: number | null;
    type: string;
    appointmentDate: string;
    notes?: string;
}