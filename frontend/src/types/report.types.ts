export interface SalonAppointmentReport {
    id: number;
    appointmentDate: string;
    type: string;
    status: string;
    notes?: string;
}

export interface SalonReport {
    beginDate: string;
    endDate: string;
    countOfSalesOrders: number;
    sumOfFinalPrices: number;
    salonAppointments: SalonAppointmentReport[];
}

export interface ServiceReport {
    beginDate: string;
    endDate: string;
    scheduledRepairOrders: number;
    completedRepairOrders: number;
    canceledRepairOrders: number;
}