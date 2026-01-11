package com.pz.salon_serwis.model;

import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "sales_order_items")
public class SalesOrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "sales_order_id", nullable = false)
    private SalesOrder order;

    @ManyToOne
    @JoinColumn(name = "vehicle_id", nullable = false, unique = true)
    private Vehicle vehicle;

    @Column(columnDefinition = "NUMERIC", precision = 14, scale = 2, nullable = false)
    private BigDecimal price;

    @Column(columnDefinition = "BOOLEAN", name = "is_active", nullable = false)
    private boolean isActive;

    @PrePersist
    protected void onCreate() {
        this.isActive = true;
    }

    public SalesOrderItem() {}

    public SalesOrderItem(Integer id, SalesOrder order, Vehicle vehicle, BigDecimal price, boolean isActive) {
        this.id = id;
        this.order = order;
        this.vehicle = vehicle;
        this.price = price;
        this.isActive = isActive;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public SalesOrder getOrder() {
        return order;
    }

    public void setOrder(SalesOrder order) {
        this.order = order;
    }

    public Vehicle getVehicle() {
        return vehicle;
    }

    public void setVehicle(Vehicle vehicle) {
        this.vehicle = vehicle;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }
}
