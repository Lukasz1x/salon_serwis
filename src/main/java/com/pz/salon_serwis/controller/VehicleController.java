package com.pz.salon_serwis.controller;


import com.pz.salon_serwis.dto.VehicleRequest;
import com.pz.salon_serwis.model.Vehicle;
import com.pz.salon_serwis.service.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/vehicles")
public class VehicleController {
    private final VehicleService vehicleService;

    @Autowired
    public VehicleController(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }

    @GetMapping("/location={id}")
    public ResponseEntity<List<Vehicle>> findVehiclesByLocationId(@PathVariable int id)
    {
        List<Vehicle> vehicles = vehicleService.findVehiclesByLocationId(id);
        return ResponseEntity.ok(vehicles);
    }

    @PostMapping("/add")
    public ResponseEntity<?> addVehicle(@RequestBody VehicleRequest vehicleRequest)
    {
        try
        {
            Vehicle vehicle = vehicleService.addVehicle(
                    vehicleRequest.getModel(),
                    vehicleRequest.getProductionYear(),
                    vehicleRequest.getVin(),
                    vehicleRequest.getCataloguePrice(),
                    vehicleRequest.getMarginPrice(),
                    vehicleRequest.getLocationId(),
                    vehicleRequest.getStatus()
            );
            if(vehicle != null){
                return ResponseEntity.ok(vehicle);
            }else{
                return ResponseEntity.badRequest().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteVehicleById(@PathVariable int id){
        return vehicleService.deleteById(id) ? ResponseEntity.ok().build() : ResponseEntity.badRequest().build();
    }
}
