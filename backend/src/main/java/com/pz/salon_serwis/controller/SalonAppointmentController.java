package com.pz.salon_serwis.controller;

import com.pz.salon_serwis.dto.SalonAppointmentRequest;
import com.pz.salon_serwis.model.SalonAppointment;
import com.pz.salon_serwis.model.User;
import com.pz.salon_serwis.service.SalonAppointmentService;
import com.pz.salon_serwis.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("api/salonAppointments")
public class SalonAppointmentController {
    private final SalonAppointmentService salonAppointmentService;
    private final UserService userService;

    @Autowired
    public SalonAppointmentController(SalonAppointmentService salonAppointmentService, UserService userService) {
        this.salonAppointmentService = salonAppointmentService;
        this.userService = userService;
    }

    @GetMapping("/all")
    public ResponseEntity<List<SalonAppointment>> getAllSalonAppointments(){
        try{
            List<SalonAppointment> salonAppointments = salonAppointmentService.getAll();
            return ResponseEntity.ok(salonAppointments);
        }catch (Exception e){
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/arrange")
    public ResponseEntity<?> arrangeAppointment(@AuthenticationPrincipal UserDetails userDetails, @RequestBody SalonAppointmentRequest salonAppointmentRequest)
    {
        try
        {
            String email = userDetails.getUsername();
            Optional<User> user = userService.findByEmail(email);
            if(user.isPresent()){
                SalonAppointment salonAppointment = salonAppointmentService.arrangeAppointment(
                        user.get().getId(),
                        salonAppointmentRequest.getEmployeeId(),
                        salonAppointmentRequest.getLocationId(),
                        salonAppointmentRequest.getVehicleId(),
                        salonAppointmentRequest.getType(),
                        salonAppointmentRequest.getAppointmentDate(),
                        salonAppointmentRequest.getNotes()
                );
                return ResponseEntity.ok(salonAppointment);
            }
        }catch (Exception e)
        {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
        return ResponseEntity.badRequest().body("Error: Employee/location not found");
    }

    @PutMapping("/changeStatus={status}&appointmentId={salonAppointmentId}")
    public ResponseEntity<?> changeStatus(@PathVariable String status, @PathVariable int salonAppointmentId){
        try{
            SalonAppointment salonAppointment = salonAppointmentService.changeStatus(salonAppointmentId, status);
            if(salonAppointment != null){
                return ResponseEntity.ok(salonAppointment);
            }
        }catch (Exception e){
            return ResponseEntity.internalServerError().build();
        }
        return ResponseEntity.badRequest().build();
    }

    @GetMapping("/filter")
    public ResponseEntity<List<SalonAppointment>> getAppointmentsByLocationAndDate(
            @RequestParam int locationId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        List<SalonAppointment> appointments = salonAppointmentService.getAppointmentsByLocationAndDate(locationId, date);
        return ResponseEntity.ok(appointments);
    }
}
