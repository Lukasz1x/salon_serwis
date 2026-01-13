package com.pz.salon_serwis.service;

import com.pz.salon_serwis.model.ServiceAppointment;
import com.pz.salon_serwis.model.ServiceType;

import java.time.LocalDateTime;

public interface ServiceAppointmentService {
    public ServiceAppointment arrangeService(int clientId, int vehicleId, int locationId,
                                              ServiceType type, String issueDescription,
                                              LocalDateTime appointmentDate);
}
