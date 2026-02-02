package com.pz.salon_serwis.controller;

import com.pz.salon_serwis.dto.RepairOrderRequest;
import com.pz.salon_serwis.model.RepairOrder;
import com.pz.salon_serwis.model.User;
import com.pz.salon_serwis.service.RepairOrderService;
import com.pz.salon_serwis.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
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

    @PostMapping("/generate")
    public ResponseEntity<?> generateRepairOrder(@AuthenticationPrincipal UserDetails userDetails, @RequestBody RepairOrderRequest repairOrderRequest) {
        try{
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
