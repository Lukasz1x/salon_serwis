package com.pz.salon_serwis.dto;

import com.pz.salon_serwis.model.Location;
import com.pz.salon_serwis.model.VehicleStatus;

import java.math.BigDecimal;

public class VehicleRequest {
    private String model;
    private Integer productionYear;
    private String vin;
    private BigDecimal cataloguePrice;
    private BigDecimal marginPrice;
    private Location location;
    private VehicleStatus status;

    public VehicleRequest(String model, Integer productionYear, String vin, BigDecimal cataloguePrice, BigDecimal marginPrice, Location location, VehicleStatus status) {
        this.model = model;
        this.productionYear = productionYear;
        this.vin = vin;
        this.cataloguePrice = cataloguePrice;
        this.marginPrice = marginPrice;
        this.location = location;
        this.status = status;
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

    public VehicleStatus getStatus() {
        return status;
    }

    public void setStatus(VehicleStatus status) {
        this.status = status;
    }
}
