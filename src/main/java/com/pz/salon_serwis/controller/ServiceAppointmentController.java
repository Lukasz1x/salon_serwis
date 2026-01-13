package com.pz.salon_serwis.controller;

import com.pz.salon_serwis.dto.SalonAppointmentRequest;
import com.pz.salon_serwis.dto.ServiceAppointmentRequest;
import com.pz.salon_serwis.model.ServiceAppointment;
import com.pz.salon_serwis.service.ServiceAppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/serviceAppointments")
public class ServiceAppointmentController {
    private final ServiceAppointmentService serviceAppointmentService;

    @Autowired
    public ServiceAppointmentController(ServiceAppointmentService serviceAppointmentService) {
        this.serviceAppointmentService = serviceAppointmentService;
    }

    @PostMapping("arrange")
    public ResponseEntity<?> arrangeAppointment(@RequestBody ServiceAppointmentRequest serviceAppointmentRequest)
    {
        try
        {
            ServiceAppointment serviceAppointment = serviceAppointmentService.arrangeService(
                    serviceAppointmentRequest.getClientId(),
                    serviceAppointmentRequest.getVehicleId(),
                    serviceAppointmentRequest.getLocationId(),
                    serviceAppointmentRequest.getType(),
                    serviceAppointmentRequest.getIssueDescription(),
                    serviceAppointmentRequest.getAppointmentDate()
            );
            if(serviceAppointment == null)
            {
                return ResponseEntity.badRequest().body("Error: Client/vehicle/location not found");
            }
            return ResponseEntity.ok(serviceAppointment);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }
}
