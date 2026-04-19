package com.pz.salon_serwis.service;

import com.pz.salon_serwis.model.Location;
import com.pz.salon_serwis.model.LocationType;

import java.math.BigDecimal;
import java.util.List;

public interface LocationService {
    List<Location> getLocations();
    Location findById(int locationId);
    Location findByLongLat(BigDecimal longitude, BigDecimal latitude);
    Location addLocation(String name, String phone, String street, String city, String zipCode, BigDecimal latitude, BigDecimal longitude, LocationType locationType);
    void deleteById(int id);
}
