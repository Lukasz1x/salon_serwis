package com.pz.salon_serwis.controller;

import com.pz.salon_serwis.dto.RepairOrderRequest;
import com.pz.salon_serwis.model.RepairOrder;
import com.pz.salon_serwis.model.User;
import com.pz.salon_serwis.service.RepairOrderService;
import com.pz.salon_serwis.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("api/repairOrder")
public class RepairOrderController {
    private final RepairOrderService repairOrderService;
    private final UserService userService;

    @Autowired
    public RepairOrderController(RepairOrderService repairOrderService, UserService userService) {
        this.repairOrderService = repairOrderService;
        this.userService = userService;
    }

    @GetMapping("/all")
    public ResponseEntity<List<RepairOrder>> getAllRepairOrders(){
        try{
            List<RepairOrder> repairOrders = repairOrderService.getAll();
            return ResponseEntity.ok(repairOrders);
        }catch (Exception e){
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/appointment/{appointmentId}")
    public ResponseEntity<?> getRepairOrderByAppointmentId(@PathVariable int appointmentId) {
        try {
            Optional<RepairOrder> repairOrder = repairOrderService.getByAppointmentId(appointmentId);
            if (repairOrder.isPresent()) {
                return ResponseEntity.ok(repairOrder.get());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Brak polecenia naprawy dla tej wizyty.");
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/generate")
    public ResponseEntity<?> generateRepairOrder(@AuthenticationPrincipal UserDetails userDetails, @RequestBody RepairOrderRequest repairOrderRequest) {
        try{
            Optional<RepairOrder> existingOrder = repairOrderService.getByAppointmentId(repairOrderRequest.getAppointmentId());
            if (existingOrder.isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Błąd: Polecenie naprawy dla tej wizyty już istnieje!");
            }

            String email = userDetails.getUsername();
            Optional<User> user = userService.findByEmail(email);
            if(user.isPresent()){
                RepairOrder repairOrder = repairOrderService.generateRepairOrder(
                        repairOrderRequest.getAppointmentId(),
                        user.get().getId()
                );
                return ResponseEntity.ok(repairOrder);
            }
        }catch (Exception e){
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
        return ResponseEntity.badRequest().body("Error: Cannot generate repairOrder");
    }

    @PutMapping("/addDescription&repairId={repairOrderId}")
    public ResponseEntity<?> addWorkDescription(@PathVariable int repairOrderId, @RequestBody Map<String, BigDecimal> description){
        try{
            RepairOrder repairOrder = repairOrderService.addWorkDescription(repairOrderId, description);
            if(repairOrder != null){
                return ResponseEntity.ok(repairOrder);
            }
        }catch(Exception e){
            return ResponseEntity.internalServerError().build();
        }
        return ResponseEntity.badRequest().build();
    }

    @PutMapping("/addFinalDate={date}&repairId={repairOrderId}")
    public ResponseEntity<?> addFinalDate(@PathVariable int repairOrderId, @PathVariable LocalDateTime date){
        try{
            RepairOrder repairOrder = repairOrderService.addFinalDate(repairOrderId, date);
            if(repairOrder != null){
                return ResponseEntity.ok(repairOrder);
            }
        }catch(Exception e){
            return ResponseEntity.internalServerError().build();
        }
        return ResponseEntity.badRequest().build();
    }
}
