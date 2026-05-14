package com.pz.salon_serwis.service;

import com.pz.salon_serwis.model.Invoice;

import java.math.BigDecimal;
import java.time.LocalDate;

public interface InvoiceService {
    Invoice generateSaleInvoice(String id, int clientId, int saleOrderId, LocalDate dueDate);
    Invoice generateRepairInvoice(String id, int serviceAppointmentId, LocalDate dueDate);
}
