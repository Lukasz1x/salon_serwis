package com.pz.salon_serwis.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class InvoiceRequest {
    private String id;
    private int clientId;
    private int serviceId;
    private LocalDate dueDate;
    private BigDecimal totalAmount;

    public InvoiceRequest(String id, int clientId, int serviceId, LocalDate dueDate, BigDecimal totalAmount) {
        this.id = id;
        this.clientId = clientId;
        this.serviceId = serviceId;
        this.dueDate = dueDate;
        this.totalAmount = totalAmount;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public int getClientId() {
        return clientId;
    }

    public void setClientId(int clientId) {
        this.clientId = clientId;
    }

    public int getServiceId() {
        return serviceId;
    }

    public void setServiceId(int serviceId) {
        this.serviceId = serviceId;
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
