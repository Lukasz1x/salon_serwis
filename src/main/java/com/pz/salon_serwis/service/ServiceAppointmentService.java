package com.pz.salon_serwis.service;

import com.pz.salon_serwis.model.ServiceAppointment;
import com.pz.salon_serwis.model.ServiceType;

import java.time.LocalDateTime;
import java.util.List;

public interface ServiceAppointmentService {
    ServiceAppointment arrangeService(int clientId, int vehicleId, int locationId,
                                              ServiceType type, String issueDescription,
                                              LocalDateTime appointmentDate);
    List<ServiceAppointment> findAllByAppointmentDateBetween(LocalDateTime beginDate, LocalDateTime endDate);
}
