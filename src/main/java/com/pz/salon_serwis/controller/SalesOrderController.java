package com.pz.salon_serwis.controller;

import com.pz.salon_serwis.dto.SalesOrderRequest;
import com.pz.salon_serwis.model.SalesOrder;
import com.pz.salon_serwis.model.User;
import com.pz.salon_serwis.service.SalesOrderService;
import com.pz.salon_serwis.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("api/salesOrder")
public class SalesOrderController {
    private final SalesOrderService salesOrderService;
    private final UserService userService;

    @Autowired
    public SalesOrderController(SalesOrderService salesOrderService, UserService userService) {
        this.salesOrderService = salesOrderService;
        this.userService = userService;
    }

    @GetMapping("/all")
    public ResponseEntity<List<SalesOrder>> getAllSalesOrders(){
        try{
            List<SalesOrder> salesOrders = salesOrderService.getAll();
            return ResponseEntity.ok(salesOrders);
        }catch (Exception e){
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/generate")
    public ResponseEntity<?> generateSalesOrder(@AuthenticationPrincipal UserDetails userDetails, @RequestBody SalesOrderRequest salesOrderRequest) {
        try{
            String email = userDetails.getUsername();
            Optional<User> user = userService.findByEmail(email);
            if(user.isPresent()){
                SalesOrder salesOrder = salesOrderService.generateSalesOrder(
                        salesOrderRequest.getClientId(),
                        user.get().getId(),
                        salesOrderRequest.getVehiclesIds(),
                        salesOrderRequest.getSaleDate()
                );
                return ResponseEntity.ok(salesOrder);
            }
        } catch (Exception e){
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
        return ResponseEntity.badRequest().body("Error: Cannot generate SalesOrder");
    }
}
