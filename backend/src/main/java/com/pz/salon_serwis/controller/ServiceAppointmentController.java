package com.pz.salon_serwis.controller;

import com.pz.salon_serwis.dto.ServiceAppointmentRequest;
import com.pz.salon_serwis.model.ServiceAppointment;
import com.pz.salon_serwis.model.ServiceStatus;
import com.pz.salon_serwis.model.User;
import com.pz.salon_serwis.service.ServiceAppointmentService;
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
@RequestMapping("api/serviceAppointments")
public class ServiceAppointmentController {
    private final ServiceAppointmentService serviceAppointmentService;
    private final UserService userService;

    @Autowired
    public ServiceAppointmentController(ServiceAppointmentService serviceAppointmentService, UserService userService) {
        this.serviceAppointmentService = serviceAppointmentService;
        this.userService = userService;
    }

    @GetMapping("/all")
    public ResponseEntity<List<ServiceAppointment>> getAllServiceAppointments(){
        try{
            List<ServiceAppointment> serviceAppointments = serviceAppointmentService.getAll();
            return ResponseEntity.ok(serviceAppointments);
        }catch (Exception e){
            return ResponseEntity.internalServerError().build();
        }
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

    @GetMapping("/filter")
    public ResponseEntity<List<ServiceAppointment>> getAppointmentsByLocationAndDate(
            @RequestParam int locationId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        List<ServiceAppointment> appointments = serviceAppointmentService.getAppointmentsByLocationAndDate(locationId, date);
        return ResponseEntity.ok(appointments);
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyServiceAppointments(Principal principal) {
        try {
            String email = principal.getName();

            User currentUser = userService.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Nie znaleziono użytkownika"));

            List<ServiceAppointment> appointments = serviceAppointmentService.getAppointmentsByClient(currentUser.getId());
            return ResponseEntity.ok(appointments);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Błąd podczas pobierania zgłoszeń: " + e.getMessage());
        }
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelMyServiceAppointment(@PathVariable Integer id, Principal principal) {
        try {
            User currentUser = userService.findByEmail(principal.getName())
                    .orElseThrow(() -> new RuntimeException("Nie znaleziono użytkownika"));

            ServiceAppointment appointment = serviceAppointmentService.findById(id)
                    .orElseThrow(() -> new RuntimeException("Nie znaleziono zgłoszenia"));

            if (!appointment.getClient().getId().equals(currentUser.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Brak uprawnień do tego zgłoszenia.");
            }

            if (appointment.getServiceStatus() != ServiceStatus.SCHEDULED) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Można anulować tylko zaplanowane naprawy.");
            }

            appointment.setServiceStatus(ServiceStatus.CANCELLED);
            serviceAppointmentService.save(appointment);

            return ResponseEntity.ok("Zgłoszenie anulowane pomyślnie.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Błąd: " + e.getMessage());
        }
    }
}
