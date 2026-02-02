package com.pz.salon_serwis.model;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;

@Entity
@Table(name = "vehicles")
public class Vehicle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "client_id")
    private User client;

    @Column(nullable = false)
    private String model;

    @Column(name = "production_year", nullable = false)
    private Integer productionYear;

    @Column(unique = true, nullable = false)
    private String vin;

    @Column(name = "engine_spec")
    private String engineSpec;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb" ,name = "equipment_details")
    private Map<String, String> equipment;

    @Column(name = "catalogue_price", precision = 14, scale = 2, nullable = false)
    private BigDecimal cataloguePrice;

    @Column(name = "margin_price", precision = 14, scale = 2, nullable = false)
    private BigDecimal marginPrice;

    @ManyToOne
    @JoinColumn(name = "location_id", nullable = false)
    private Location location;

    @Column(name = "added_at", nullable = false)
    private LocalDateTime addedAt;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "status", nullable = false)
    private VehicleStatus status;

    @Column(name = "last_status_change")
    private LocalDateTime lastStatusChange;

    @Column(columnDefinition = "BOOLEAN", name = "is_active", nullable = false)
    private boolean isActive;

    @PrePersist
    protected void onCreate() {
        this.lastStatusChange = LocalDateTime.now();
        this.isActive = true;
    }

    public Vehicle(String model, Integer productionYear, String vin, BigDecimal cataloguePrice, BigDecimal marginPrice, Location location, LocalDateTime addedAt, VehicleStatus status, boolean isActive) {
        this.model = model;
        this.productionYear = productionYear;
        this.vin = vin;
        this.cataloguePrice = cataloguePrice;
        this.marginPrice = marginPrice;
        this.location = location;
        this.addedAt = addedAt;
        this.status = status;
        this.isActive = isActive;
    }

    public Vehicle() {}

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

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public Integer getProductionYear() {
        return productionYear;
    }

    public void setProductionYear(Integer productionYear) {
        this.productionYear = productionYear;
    }

    public String getVin() {
        return vin;
    }

    public void setVin(String vin) {
        this.vin = vin;
    }

    public String getEngineSpec() {
        return engineSpec;
    }

    public void setEngineSpec(String engineSpec) {
        this.engineSpec = engineSpec;
    }

    public Map<String, String> getEquipment() {
        return equipment;
    }

    public void setEquipment(Map<String, String> equipment) {
        this.equipment = equipment;
    }

    public BigDecimal getCataloguePrice() {
        return cataloguePrice;
    }

    public void setCataloguePrice(BigDecimal cataloguePrice) {
        this.cataloguePrice = cataloguePrice;
    }

    public BigDecimal getMarginPrice() {
        return marginPrice;
    }

    public void setMarginPrice(BigDecimal marginPrice) {
        this.marginPrice = marginPrice;
    }

    public Location getLocation() {
        return location;
    }

    public void setLocation(Location location) {
        this.location = location;
    }

    public LocalDateTime getAddedAt() {
        return addedAt;
    }

    public void setAddedAt(LocalDateTime addedAt) {
        this.addedAt = addedAt;
    }

    public VehicleStatus getStatus() {
        return status;
    }

    public void setStatus(VehicleStatus status) {
        this.status = status;
    }

    public LocalDateTime getLastStatusChange() {
        return lastStatusChange;
    }

    public void setLastStatusChange(LocalDateTime lastStatusChange) {
        this.lastStatusChange = lastStatusChange;
    }

    public boolean getActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }
}
