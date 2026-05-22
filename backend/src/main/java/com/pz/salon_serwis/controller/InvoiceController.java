package com.pz.salon_serwis.controller;

import com.pz.salon_serwis.dto.RepairInvoiceRequest;
import com.pz.salon_serwis.dto.SaleInvoiceRequest;
import com.pz.salon_serwis.model.Invoice;
import com.pz.salon_serwis.model.User;
import com.pz.salon_serwis.service.InvoiceService;
import com.pz.salon_serwis.service.PdfGeneratorService;
import com.pz.salon_serwis.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
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
    private final PdfGeneratorService pdfGeneratorService;

    @Autowired
    public InvoiceController(InvoiceService invoiceService, UserService userService, PdfGeneratorService pdfGeneratorService) {
        this.invoiceService = invoiceService;
        this.userService = userService;
        this.pdfGeneratorService = pdfGeneratorService;
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
                        saleInvoiceRequest.getDueDate()
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
                   repairInvoiceRequest.getDueDate()
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

    @GetMapping("/getSaleInvoice")
    public ResponseEntity<byte[]> getSaleInvoice(@RequestParam String invoiceId){
        try{
            Optional<Invoice> invoice = invoiceService.getInvoiceById(invoiceId);
            if (invoice.isPresent()){
                byte[] pdfBytes = pdfGeneratorService.generateInvoice(invoice.get(), PdfGeneratorService.TYPE.SALES_ORDER);
                String filename = "SaleInvoice-" + invoice.get().getDueDate().toString() + ".pdf";

                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION,
                                "inline; filename=\"" + filename + "\"")
                        .contentType(MediaType.APPLICATION_PDF)
                        .body(pdfBytes);
            }
        } catch (Exception e){
            return ResponseEntity.internalServerError().body(("Error: " + e.getMessage()).getBytes());
        }
        return ResponseEntity.badRequest().body(("Error: Invoice not found").getBytes());
    }

    @GetMapping("/getRepairInvoice")
    public ResponseEntity<byte[]> getRepairInvoice(@RequestParam String invoiceId){
        try{
            Optional<Invoice> invoice = invoiceService.getInvoiceById(invoiceId);
            if(invoice.isPresent()){
                byte[] pdfBytes = pdfGeneratorService.generateInvoice(invoice.get(), PdfGeneratorService.TYPE.SERVICE_ORDER);
                String filename = "RepairInvoice-" + invoice.get().getDueDate().toString() + ".pdf";

                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION,
                                "inline; filename=\"" + filename + "\"")
                        .contentType(MediaType.APPLICATION_PDF)
                        .body(pdfBytes);
            }
        } catch (Exception e){
            return ResponseEntity.internalServerError().body(("Error: " + e.getMessage()).getBytes());
        }
            return ResponseEntity.badRequest().body(("Error: Invoice not found").getBytes());
    }
}
