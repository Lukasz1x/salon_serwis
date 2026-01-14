package com.pz.salon_serwis.service.impl;

import com.pz.salon_serwis.model.Location;
import com.pz.salon_serwis.model.Vehicle;
import com.pz.salon_serwis.model.VehicleStatus;
import com.pz.salon_serwis.repository.VehicleRepository;
import com.pz.salon_serwis.service.VehicleService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class VehicleServiceImpl implements VehicleService {
    private final VehicleRepository vehicleRepository;

    public VehicleServiceImpl(VehicleRepository vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }

    @Override
    public List<Vehicle> findVehiclesByLocationId(int locationId) {
        return vehicleRepository.findByLocationId(locationId);
    }

    @Override
    public Vehicle addVehicle(String model, Integer productionYear, String vin, BigDecimal cataloguePrice, BigDecimal marginPrice, Location location, VehicleStatus status)
    {
        Vehicle vehicle = new Vehicle(model, productionYear, vin, cataloguePrice, marginPrice, location, LocalDateTime.now(), status, true);
        return vehicleRepository.save(vehicle);
    }
}
