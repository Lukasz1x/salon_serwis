package com.pz.salon_serwis.service;

import com.pz.salon_serwis.model.Invoice;

import java.math.BigDecimal;
import java.time.LocalDate;

public interface InvoiceService {
    public Invoice generateInvoice(String id, int clientId, LocalDate dueDate, BigDecimal totalAmount);
}
