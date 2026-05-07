package com.pz.salon_serwis.service;

import com.pz.salon_serwis.model.Vehicle;
import com.pz.salon_serwis.model.VehicleStatus;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public interface VehicleService {
    List<Vehicle> findVehiclesByLocationId(int locationId);
    List<Vehicle> getVehiclesByClient(int clientId);
    Vehicle addVehicle(String model, Integer productionYear, String vin, BigDecimal cataloguePrice, BigDecimal marginPrice, Integer locationId, VehicleStatus status);
    Vehicle specifyEngine(int vehicleId, String engineSpecification);
    Vehicle specifyEquipment(int vehicleId, Map<String, String> equipment);
    boolean deleteById(int id);
}
