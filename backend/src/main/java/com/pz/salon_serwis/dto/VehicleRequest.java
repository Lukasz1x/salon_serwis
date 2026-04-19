package com.pz.salon_serwis.dto;

import com.pz.salon_serwis.model.VehicleStatus;

import java.math.BigDecimal;

public class VehicleRequest {
    private String model;
    private Integer productionYear;
    private String vin;
    private BigDecimal cataloguePrice;
    private BigDecimal marginPrice;
    private Integer locationId;
    private VehicleStatus status;

    public VehicleRequest(String model, Integer productionYear, String vin, BigDecimal cataloguePrice, BigDecimal marginPrice, Integer locationId, VehicleStatus status) {
        this.model = model;
        this.productionYear = productionYear;
        this.vin = vin;
        this.cataloguePrice = cataloguePrice;
        this.marginPrice = marginPrice;
        this.locationId = locationId;
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

    public Integer getLocationId() {
        return locationId;
    }

    public void setLocationId(Integer locationId) {
        this.locationId = locationId;
    }

    public VehicleStatus getStatus() {
        return status;
    }

    public void setStatus(VehicleStatus status) {
        this.status = status;
    }
}
