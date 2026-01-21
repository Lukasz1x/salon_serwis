package com.pz.salon_serwis.controller;

import com.pz.salon_serwis.dto.InvoiceRequest;
import com.pz.salon_serwis.model.Invoice;
import com.pz.salon_serwis.service.InvoiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/invoice")
public class InvoiceController {
    private final InvoiceService invoiceService;

    @Autowired
    public InvoiceController(InvoiceService invoiceService) {
        this.invoiceService = invoiceService;
    }

    @PostMapping("generate")
    public ResponseEntity<?> generateInvoice(@RequestBody InvoiceRequest invoiceRequest) {
        try
        {
            Invoice invoice = invoiceService.generateInvoice(
                    invoiceRequest.getId(),
                    invoiceRequest.getClientId(),
                    invoiceRequest.getDueDate(),
                    invoiceRequest.getTotalAmount()
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

}
