package com.pz.salon_serwis.service;

import com.pz.salon_serwis.model.Location;

import java.math.BigDecimal;

public interface LocationService {
    Location findById(int locationId);
    Location findByLongLat(BigDecimal longitude, BigDecimal latitude);
}
