package com.pz.salon_serwis.controller;

import com.pz.salon_serwis.model.Vehicle;
import com.pz.salon_serwis.service.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/vehicles")
public class VehicleController {
    private final VehicleService vehicleService;

    @Autowired
    public VehicleController(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }

    @GetMapping("location={id}")
    public ResponseEntity<List<Vehicle>> findVehiclesByLocationId(@PathVariable int id)
    {
        List<Vehicle> vehicles = vehicleService.findVehiclesByLocationId(id);
        return ResponseEntity.ok(vehicles);
    }
}
