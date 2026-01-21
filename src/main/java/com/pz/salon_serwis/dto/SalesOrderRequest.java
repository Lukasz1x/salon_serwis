package com.pz.salon_serwis.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class SalesOrderRequest {
    private int employeeId;
    private int clientId;
    private LocalDateTime saleDate;
    private BigDecimal price;

    public SalesOrderRequest(int clientId, int employeeId, LocalDateTime saleDate, BigDecimal price) {
        this.clientId = clientId;
        this.employeeId = employeeId;
        this.saleDate = saleDate;
        this.price = price;
    }

    public int getClientId() {
        return clientId;
    }

    public void setClientId(int clientId) {
        this.clientId = clientId;
    }

    public int getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(int employeeId) {
        this.employeeId = employeeId;
    }

    public LocalDateTime getSaleDate() {
        return saleDate;
    }

    public void setSaleDate(LocalDateTime saleDate) {
        this.saleDate = saleDate;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }
}
