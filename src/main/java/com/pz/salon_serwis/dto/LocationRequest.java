package com.pz.salon_serwis.dto;

import com.pz.salon_serwis.model.LocationType;

import java.math.BigDecimal;

public class LocationRequest {
    private String name;
    private String phone;
    private String street;
    private String city;
    private String zipCode;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private LocationType locationType;

    public LocationRequest(String name, String phone, String street, String city, String zipCode, BigDecimal latitude, BigDecimal longitude, LocationType locationType) {
        this.name = name;
        this.phone = phone;
        this.street = street;
        this.city = city;
        this.zipCode = zipCode;
        this.latitude = latitude;
        this.longitude = longitude;
        this.locationType = locationType;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getStreet() {
        return street;
    }

    public void setStreet(String street) {
        this.street = street;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getZipCode() {
        return zipCode;
    }

    public void setZipCode(String zipCode) {
        this.zipCode = zipCode;
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

    public LocationType getLocationType() {
        return locationType;
    }

    public void setLocationType(LocationType locationType) {
        this.locationType = locationType;
    }
}
