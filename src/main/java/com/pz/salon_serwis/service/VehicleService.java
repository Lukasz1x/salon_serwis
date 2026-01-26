package com.pz.salon_serwis.service;

import com.pz.salon_serwis.model.Vehicle;
import com.pz.salon_serwis.model.VehicleStatus;

import java.math.BigDecimal;
import java.util.List;

public interface VehicleService {
    List<Vehicle> findVehiclesByLocationId(int locationId);
    Vehicle addVehicle(String model, Integer productionYear, String vin, BigDecimal cataloguePrice, BigDecimal marginPrice, Integer locationId, VehicleStatus status);
    boolean deleteById(int id);
}
