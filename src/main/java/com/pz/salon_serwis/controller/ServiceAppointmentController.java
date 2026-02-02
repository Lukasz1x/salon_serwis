package com.pz.salon_serwis.controller;

import com.pz.salon_serwis.dto.ServiceAppointmentRequest;
import com.pz.salon_serwis.model.ServiceAppointment;
import com.pz.salon_serwis.model.User;
import com.pz.salon_serwis.service.ServiceAppointmentService;
import com.pz.salon_serwis.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("api/serviceAppointments")
public class ServiceAppointmentController {
    private final ServiceAppointmentService serviceAppointmentService;
    private final UserService userService;

    @Autowired
    public ServiceAppointmentController(ServiceAppointmentService serviceAppointmentService, UserService userService) {
        this.serviceAppointmentService = serviceAppointmentService;
        this.userService = userService;
    }

    @PostMapping("/arrange")
    public ResponseEntity<?> arrangeAppointment(@AuthenticationPrincipal UserDetails userDetails, @RequestBody ServiceAppointmentRequest serviceAppointmentRequest)
    {
        try
        {
            String email = userDetails.getUsername();
            Optional<User> user = userService.findByEmail(email);
            if(user.isPresent()){
                ServiceAppointment serviceAppointment = serviceAppointmentService.arrangeService(
                        user.get().getId(),
                        serviceAppointmentRequest.getVehicleId(),
                        serviceAppointmentRequest.getLocationId(),
                        serviceAppointmentRequest.getType(),
                        serviceAppointmentRequest.getIssueDescription(),
                        serviceAppointmentRequest.getAppointmentDate()
                );
                return ResponseEntity.ok(serviceAppointment);
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
        return ResponseEntity.badRequest().body("Error: Vehicle/location not found");
    }

    @PutMapping("/changeStatus={status}&appointmentId={serviceAppointmentId}")
    public ResponseEntity<?> changeStatus(@PathVariable String status, @PathVariable int serviceAppointmentId){
        try{
            ServiceAppointment serviceAppointment = serviceAppointmentService.changeStatus(serviceAppointmentId, status);
            if(serviceAppointment != null){
                return ResponseEntity.ok(serviceAppointment);
            }
        }catch (Exception e){
            return ResponseEntity.internalServerError().build();
        }
        return ResponseEntity.badRequest().build();
    }
}
