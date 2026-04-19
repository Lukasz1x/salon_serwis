package com.pz.salon_serwis.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class SaleInvoiceRequest {
    private String id;
    private int saleOrderId;
    private LocalDate dueDate;
    private BigDecimal totalAmount;

    public SaleInvoiceRequest(String id, int saleOrderId, LocalDate dueDate, BigDecimal totalAmount) {
        this.id = id;
        this.saleOrderId = saleOrderId;
        this.dueDate = dueDate;
        this.totalAmount = totalAmount;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public int getSaleOrderId() {
        return saleOrderId;
    }

    public void setSaleOrderId(int saleOrderId) {
        this.saleOrderId = saleOrderId;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }
}
