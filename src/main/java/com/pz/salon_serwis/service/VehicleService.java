package com.pz.salon_serwis.service;

import com.pz.salon_serwis.model.Location;
import com.pz.salon_serwis.model.Vehicle;
import com.pz.salon_serwis.model.VehicleStatus;

import java.math.BigDecimal;
import java.util.List;

public interface VehicleService {
    public List<Vehicle> findVehiclesByLocationId(int locationId);
    public Vehicle addVehicle(String model, Integer productionYear, String vin, BigDecimal cataloguePrice, BigDecimal marginPrice, Location location, VehicleStatus status);
}
