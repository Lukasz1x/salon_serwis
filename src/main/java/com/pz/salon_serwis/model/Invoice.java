package com.pz.salon_serwis.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "invoices")
public class Invoice {

    @Id
    private String id;

    @ManyToOne
    @JoinColumn(name = "client_id", nullable = false)
    private User client;

    @Column(name = "issue_date", nullable = false)
    private LocalDate issueDate = LocalDate.now();

    @Column(name = "due_date", nullable = false)
    private LocalDate dueDate;

    @Column(name = "total_amount", nullable = false)
    private BigDecimal totalAmount;

    @OneToOne
    @JoinColumn(name = "sales_order_id")
    private SalesOrder salesOrder;

    @OneToOne
    @JoinColumn(name = "repair_order_id")
    private RepairOrder repairOrder;

    @Column(columnDefinition = "BOOLEAN", name = "is_active", nullable = false)
    private boolean isActive;

    @PrePersist
    protected void onCreate() {
        this.isActive = true;
    }

    public Invoice() {}

    public Invoice(String id, User client, LocalDate issueDate, LocalDate dueDate, BigDecimal totalAmount, boolean isActive) {
        this.id = id;
        this.client = client;
        this.issueDate = issueDate;
        this.dueDate = dueDate;
        this.totalAmount = totalAmount;
        this.isActive = isActive;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public User getClient() {
        return client;
    }

    public void setClient(User client) {
        this.client = client;
    }

    public LocalDate getIssueDate() {
        return issueDate;
    }

    public void setIssueDate(LocalDate issueDate) {
        this.issueDate = issueDate;
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

    public SalesOrder getSalesOrder() {
        return salesOrder;
    }

    public void setSalesOrder(SalesOrder salesOrder) {
        this.salesOrder = salesOrder;
    }

    public RepairOrder getRepairOrder() {
        return repairOrder;
    }

    public void setRepairOrder(RepairOrder repairOrder) {
        this.repairOrder = repairOrder;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }
}