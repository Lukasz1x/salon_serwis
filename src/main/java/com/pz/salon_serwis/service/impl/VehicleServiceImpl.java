package com.pz.salon_serwis.service.impl;

import com.pz.salon_serwis.model.Vehicle;
import com.pz.salon_serwis.repository.VehicleRepository;
import com.pz.salon_serwis.service.VehicleService;
import org.springframework.stereotype.Service;

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
}
