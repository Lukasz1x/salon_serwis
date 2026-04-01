package com.pz.salon_serwis.service;

import com.pz.salon_serwis.model.SalonAppointment;
import com.pz.salon_serwis.model.SalonAppointmentType;

import java.time.LocalDateTime;
import java.util.List;

public interface SalonAppointmentService {
    List<SalonAppointment> getAll();
    SalonAppointment arrangeAppointment(int clientId, int employeeId, int locationId, Integer vehicleId,
                                        SalonAppointmentType type, LocalDateTime appointmentDate, String notes);
    SalonAppointment changeStatus(int salonAppointmentId, String status);
    List<SalonAppointment> getSalonAppointmentsBetween(LocalDateTime startDate, LocalDateTime endDate);
}
