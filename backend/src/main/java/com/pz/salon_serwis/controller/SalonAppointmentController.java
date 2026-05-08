package com.pz.salon_serwis.controller;

import com.pz.salon_serwis.dto.SalonAppointmentRequest;
import com.pz.salon_serwis.model.SalonAppointment;
import com.pz.salon_serwis.model.SalonAppointmentStatus;
import com.pz.salon_serwis.model.ServiceStatus;
import com.pz.salon_serwis.model.User;
import com.pz.salon_serwis.repository.UserRepository;
import com.pz.salon_serwis.service.SalonAppointmentService;
import com.pz.salon_serwis.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
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

    @GetMapping("/my")
    public ResponseEntity<?> getMySalonAppointments(Principal principal) {
        try {
            String email = principal.getName();

            User currentUser = userService.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Nie znaleziono użytkownika"));

            List<SalonAppointment> appointments = salonAppointmentService.getAppointmentsByClient(currentUser.getId());
            return ResponseEntity.ok(appointments);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Błąd podczas pobierania wizyt: " + e.getMessage());
        }
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelMySalonAppointment(@PathVariable Integer id, Principal principal) {
        try {
            User currentUser = userService.findByEmail(principal.getName())
                    .orElseThrow(() -> new RuntimeException("Nie znaleziono użytkownika"));

            SalonAppointment appointment = salonAppointmentService.findById(id)
                    .orElseThrow(() -> new RuntimeException("Nie znaleziono wizyty"));

            if (!appointment.getClient().getId().equals(currentUser.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Brak uprawnień do tej wizyty.");
            }

            if (appointment.getStatus() != SalonAppointmentStatus.SCHEDULED) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Można anulować tylko zaplanowane wizyty.");
            }

            appointment.setStatus(SalonAppointmentStatus.CANCELLED);
            salonAppointmentService.save(appointment);

            return ResponseEntity.ok("Wizyta anulowana pomyślnie.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Błąd: " + e.getMessage());
        }
    }
}
