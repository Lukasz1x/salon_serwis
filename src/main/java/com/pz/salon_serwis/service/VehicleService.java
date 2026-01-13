package com.pz.salon_serwis.service;

import com.pz.salon_serwis.model.Vehicle;

import java.util.List;

public interface VehicleService {
    public List<Vehicle> findVehiclesByLocationId(int locationId);
}
