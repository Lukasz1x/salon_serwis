package com.pz.salon_serwis.controller;

import com.pz.salon_serwis.dto.SalonAppointmentRequest;
import com.pz.salon_serwis.model.SalonAppointment;
import com.pz.salon_serwis.service.SalonAppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/salonAppointments")
public class SalonAppointmentController {
    private final SalonAppointmentService salonAppointmentService;

    @Autowired
    public SalonAppointmentController(SalonAppointmentService salonAppointmentService) {
        this.salonAppointmentService = salonAppointmentService;
    }

    @PostMapping("/arrange")
    public ResponseEntity<?> arrangeAppointment(@RequestBody SalonAppointmentRequest salonAppointmentRequest)
    {
        try
        {
            SalonAppointment salonAppointment = salonAppointmentService.arrangeAppointment(
                    salonAppointmentRequest.getClientId(),
                    salonAppointmentRequest.getEmployeeId(),
                    salonAppointmentRequest.getLocationId(),
                    salonAppointmentRequest.getVehicleId(),
                    salonAppointmentRequest.getType(),
                    salonAppointmentRequest.getAppointmentDate(),
                    salonAppointmentRequest.getNotes()
            );
            if (salonAppointment == null)
            {
                return ResponseEntity.badRequest().body("Error: Client/employee/location not found");
            }
            return ResponseEntity.ok(salonAppointment);
        }catch (Exception e)
        {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }
}
