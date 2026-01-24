package com.pz.salon_serwis.service;

import com.pz.salon_serwis.model.SalonAppointment;
import com.pz.salon_serwis.model.SalonAppointmentType;

import java.time.LocalDateTime;
import java.util.List;

public interface SalonAppointmentService {
    SalonAppointment arrangeAppointment(int clientId, int employeeId, int locationId, Integer vehicleId,
                                        SalonAppointmentType type, LocalDateTime appointmentDate, String notes);
    List<SalonAppointment> getSalonAppointmentsBetween(LocalDateTime startDate, LocalDateTime endDate);
}
