package com.pz.salon_serwis.service.impl;

import com.pz.salon_serwis.model.Location;
import com.pz.salon_serwis.model.Vehicle;
import com.pz.salon_serwis.model.VehicleStatus;
import com.pz.salon_serwis.repository.LocationRepository;
import com.pz.salon_serwis.repository.VehicleRepository;
import com.pz.salon_serwis.service.VehicleService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class VehicleServiceImpl implements VehicleService {
    private final VehicleRepository vehicleRepository;
    private final LocationRepository locationRepository;

    public VehicleServiceImpl(VehicleRepository vehicleRepository, LocationRepository locationRepository) {
        this.vehicleRepository = vehicleRepository;
        this.locationRepository = locationRepository;
    }

    @Override
    public List<Vehicle> findVehiclesByLocationId(int locationId) {
        return vehicleRepository.findByLocationId(locationId);
    }

    @Override
    public Vehicle addVehicle(String model, Integer productionYear, String vin, BigDecimal cataloguePrice, BigDecimal marginPrice, Integer locationId, VehicleStatus status)
    {
        Optional<Location> location = locationRepository.findById(locationId);
        if(location.isPresent()){
            if(location.get().isActive()){
                Vehicle vehicle = new Vehicle(model, productionYear, vin, cataloguePrice, marginPrice, location.get(), LocalDateTime.now(), status, true);
                return vehicleRepository.save(vehicle);
            }
        }
        return null;
    }

    @Override
    public boolean deleteById(int id) {
        Optional<Vehicle> vehicle = vehicleRepository.findById(id);
        if(vehicle.isPresent()){
            vehicle.get().setActive(false);
            vehicleRepository.save(vehicle.get());
            return true;
        }
        return false;
    }
}
