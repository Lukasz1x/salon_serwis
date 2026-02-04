package com.pz.salon_serwis.service.impl;

import com.pz.salon_serwis.model.Location;
import com.pz.salon_serwis.model.LocationType;
import com.pz.salon_serwis.repository.LocationRepository;
import com.pz.salon_serwis.service.LocationService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class LocationServiceImpl implements LocationService {
    private final LocationRepository locationRepository;

    public LocationServiceImpl(LocationRepository locationRepository) {
        this.locationRepository = locationRepository;
    }

    @Override
    public Location findById(int locationId) {
        return locationRepository.findById(locationId).orElse(null);
    }

    @Override
    public Location findByLongLat(BigDecimal longitude, BigDecimal latitude) {
        return locationRepository.findByLongitudeAndLatitude(longitude,latitude).orElse(null);
    }

    @Override
    public Location addLocation(String name, String phone, String street, String city, String zipCode, BigDecimal latitude, BigDecimal longitude, LocationType locationType) {
        Location location = new Location(name, phone, street, city, zipCode, latitude, longitude, locationType);
        return locationRepository.save(location);
    }
}
