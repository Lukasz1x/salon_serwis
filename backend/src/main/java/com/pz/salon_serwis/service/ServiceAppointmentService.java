package com.pz.salon_serwis.service;

import com.pz.salon_serwis.model.SalonAppointment;
import com.pz.salon_serwis.model.ServiceAppointment;
import com.pz.salon_serwis.model.ServiceType;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ServiceAppointmentService {
    List<ServiceAppointment> getAll();
    ServiceAppointment arrangeService(int clientId, int vehicleId, int locationId,
                                              ServiceType type, String issueDescription,
                                              LocalDateTime appointmentDate);
    ServiceAppointment changeStatus(int serviceAppointmentId, String status);
    List<ServiceAppointment> findAllByAppointmentDateBetween(LocalDateTime beginDate, LocalDateTime endDate);
    List<ServiceAppointment> getAppointmentsByLocationAndDate(int locationId, LocalDate date);
    List<ServiceAppointment> getAppointmentsByClient(Integer clientId);
    Optional<ServiceAppointment> findById(Integer id);
    ServiceAppointment save(ServiceAppointment appointment);
}
