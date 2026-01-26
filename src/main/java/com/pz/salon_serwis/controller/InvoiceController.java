package com.pz.salon_serwis.controller;

import com.pz.salon_serwis.dto.RepairInvoiceRequest;
import com.pz.salon_serwis.dto.SaleInvoiceRequest;
import com.pz.salon_serwis.model.Invoice;
import com.pz.salon_serwis.service.InvoiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/invoice")
public class InvoiceController {
    private final InvoiceService invoiceService;

    @Autowired
    public InvoiceController(InvoiceService invoiceService) {
        this.invoiceService = invoiceService;
    }

    @PostMapping("/generateSale")
    public ResponseEntity<?> generateSaleInvoice(@RequestBody SaleInvoiceRequest saleInvoiceRequest) {
        try
        {
            Invoice invoice = invoiceService.generateSaleInvoice(
                    saleInvoiceRequest.getId(),
                    saleInvoiceRequest.getClientId(),
                    saleInvoiceRequest.getSaleOrderId(),
                    saleInvoiceRequest.getDueDate(),
                    saleInvoiceRequest.getTotalAmount()
            );
            if (invoice == null)
            {
                return ResponseEntity.badRequest().body("Error: Client not found");
            }
            return ResponseEntity.ok(invoice);
        }catch (Exception e)
        {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
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
