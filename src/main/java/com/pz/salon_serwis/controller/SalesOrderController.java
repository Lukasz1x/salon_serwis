package com.pz.salon_serwis.controller;

import com.pz.salon_serwis.dto.SalesOrderRequest;
import com.pz.salon_serwis.model.SalesOrder;
import com.pz.salon_serwis.service.SalesOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/salesOrder")
public class SalesOrderController {
    private final SalesOrderService salesOrderService;

    @Autowired
    public SalesOrderController(SalesOrderService salesOrderService) {
        this.salesOrderService = salesOrderService;
    }

    @PostMapping("generate")
    public ResponseEntity<?> generateSalesOrder(@RequestBody SalesOrderRequest salesOrderRequest) {
        try{
            SalesOrder salesOrder = salesOrderService.generateSalesOrder(
                    salesOrderRequest.getClientId(),
                    salesOrderRequest.getEmployeeId(),
                    salesOrderRequest.getSaleDate(),
                    salesOrderRequest.getPrice()
            );
            if (salesOrder == null) {
                return ResponseEntity.badRequest().body("Error: Cannot generate SalesOrder");
            }
            return ResponseEntity.ok(salesOrder);
        } catch (Exception e){
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }
}
