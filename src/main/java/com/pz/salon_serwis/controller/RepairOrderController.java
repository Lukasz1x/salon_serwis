package com.pz.salon_serwis.controller;

import com.pz.salon_serwis.dto.RepairOrderRequest;
import com.pz.salon_serwis.model.RepairOrder;
import com.pz.salon_serwis.service.RepairOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/repairOrder")
public class RepairOrderController {
    private final RepairOrderService repairOrderService;

    @Autowired
    public RepairOrderController(RepairOrderService repairOrderService) {
        this.repairOrderService = repairOrderService;
    }

    @PostMapping("/generate")
    public ResponseEntity<?> generateRepairOrder(@RequestBody RepairOrderRequest repairOrderRequest) {
        try{
            RepairOrder repairOrder = repairOrderService.generateRepairOrder(
                    repairOrderRequest.getAppointmentId(),
                    repairOrderRequest.getMechanicId()
            );
            if (repairOrder == null){
                return ResponseEntity.badRequest().body("Error: Cannot generate repairOrder");
            }
            return ResponseEntity.ok(repairOrder);
        }catch (Exception e){
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

}
