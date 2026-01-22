package com.pz.salon_serwis.dto;

import java.math.BigDecimal;

public class LocationRequest {
    private int locationId;
    private BigDecimal longitude;
    private BigDecimal latitude;

    public LocationRequest(int locationId, BigDecimal longitude, BigDecimal latitude) {
        this.locationId = locationId;
        this.longitude = longitude;
        this.latitude = latitude;
    }

    public int getLocationId() {
        return locationId;
    }

    public void setLocationId(int locationId) {
        this.locationId = locationId;
    }

    public BigDecimal getLongitude() {
        return longitude;
    }

    public void setLongitude(BigDecimal longitude) {
        this.longitude = longitude;
    }

    public BigDecimal getLatitude() {
        return latitude;
    }

    public void setLatitude(BigDecimal latitude) {
        this.latitude = latitude;
    }
}
