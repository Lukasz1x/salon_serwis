package com.pz.salon_serwis.controller;

import com.pz.salon_serwis.dto.RepairInvoiceRequest;
import com.pz.salon_serwis.dto.SaleInvoiceRequest;
import com.pz.salon_serwis.model.Invoice;
import com.pz.salon_serwis.model.User;
import com.pz.salon_serwis.service.InvoiceService;
import com.pz.salon_serwis.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("api/invoice")
public class InvoiceController {
    private final InvoiceService invoiceService;
    private final UserService userService;

    @Autowired
    public InvoiceController(InvoiceService invoiceService, UserService userService) {
        this.invoiceService = invoiceService;
        this.userService = userService;
    }

    @PostMapping("/generateSale")
    public ResponseEntity<?> generateSaleInvoice(@AuthenticationPrincipal UserDetails userDetails, @RequestBody SaleInvoiceRequest saleInvoiceRequest) {
        try
        {
            String email = userDetails.getUsername();
            Optional<User> user = userService.findByEmail(email);
            if(user.isPresent()){
                Invoice invoice = invoiceService.generateSaleInvoice(
                        saleInvoiceRequest.getId(),
                        user.get().getId(),
                        saleInvoiceRequest.getSaleOrderId(),
                        saleInvoiceRequest.getDueDate(),
                        saleInvoiceRequest.getTotalAmount()
                );
                return ResponseEntity.ok(invoice);
            }
        }catch (Exception e)
        {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
        return ResponseEntity.badRequest().body("Error: Client not found");
    }

    @PostMapping("/generateRepair")
    public ResponseEntity<?> generateServiceInvoice(@RequestBody RepairInvoiceRequest repairInvoiceRequest){
        try{
            Invoice invoice = invoiceService.generateRepairInvoice(
                   repairInvoiceRequest.getId(),
                   repairInvoiceRequest.getAppointmentId(),
                   repairInvoiceRequest.getDueDate(),
                   repairInvoiceRequest.getTotalAmount()
            );
            if (invoice == null)
            {
                return ResponseEntity.badRequest().body("Error: Client/Repair order not found");
            }
            return ResponseEntity.ok(invoice);
        }catch (Exception e){
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }

}
