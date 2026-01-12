package com.pz.salon_serwis.model;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "sales_orders")
public class SalesOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "client_id", nullable = false)
    private User client;

    @ManyToOne
    @JoinColumn(name = "employee_id", nullable = false)
    private User employee;

    @Column(name = "sale_date", nullable = false)
    private LocalDateTime saleDate;

    @Column(name = "final_price", columnDefinition = "NUMERIC", precision = 14, scale = 2, nullable = false)
    private BigDecimal finalPrice;

    @Column(columnDefinition = "BOOLEAN", name = "is_active", nullable = false)
    private boolean isActive;

    @PrePersist
    protected void onCreate() {
        this.isActive = true;
    }

    public SalesOrder() {}

    public SalesOrder(User client, User employee, LocalDateTime saleDate, BigDecimal finalPrice, boolean isActive) {
        this.client = client;
        this.employee = employee;
        this.saleDate = saleDate;
        this.finalPrice = finalPrice;
        this.isActive = isActive;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public User getClient() {
        return client;
    }

    public void setClient(User client) {
        this.client = client;
    }

    public User getEmployee() {
        return employee;
    }

    public void setEmployee(User employee) {
        this.employee = employee;
    }

    public LocalDateTime getSaleDate() {
        return saleDate;
    }

    public void setSaleDate(LocalDateTime saleDate) {
        this.saleDate = saleDate;
    }

    public BigDecimal getFinalPrice() {
        return finalPrice;
    }

    public void setFinalPrice(BigDecimal finalPrice) {
        this.finalPrice = finalPrice;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }
}
