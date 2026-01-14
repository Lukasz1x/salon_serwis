package com.pz.salon_serwis.service;

import com.pz.salon_serwis.model.SalonAppointment;
import com.pz.salon_serwis.model.SalonAppointmentType;

import java.time.LocalDateTime;

public interface SalonAppointmentService {
    SalonAppointment arrangeAppointment(int clientId, int employeeId, int locationId, Integer vehicleId,
                                        SalonAppointmentType type, LocalDateTime appointmentDate, String notes);
}
