package com.pz.salon_serwis.service;

import com.pz.salon_serwis.model.ServiceAppointment;
import com.pz.salon_serwis.model.ServiceType;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface ServiceAppointmentService {
    List<ServiceAppointment> getAll();
    ServiceAppointment arrangeService(int clientId, int vehicleId, int locationId,
                                              ServiceType type, String issueDescription,
                                              LocalDateTime appointmentDate);
    ServiceAppointment changeStatus(int serviceAppointmentId, String status);
    List<ServiceAppointment> findAllByAppointmentDateBetween(LocalDateTime beginDate, LocalDateTime endDate);
    List<ServiceAppointment> getAppointmentsByLocationAndDate(int locationId, LocalDate date);
}
