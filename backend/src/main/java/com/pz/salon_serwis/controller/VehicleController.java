package com.pz.salon_serwis.controller;


import com.pz.salon_serwis.dto.VehicleRequest;
import com.pz.salon_serwis.model.User;
import com.pz.salon_serwis.model.Vehicle;
import com.pz.salon_serwis.repository.UserRepository;
import com.pz.salon_serwis.service.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/vehicles")
public class VehicleController {
    private final VehicleService vehicleService;
    private final UserRepository userRepository;

    @Autowired
    public VehicleController(VehicleService vehicleService, UserRepository userRepository) {
        this.vehicleService = vehicleService;
        this.userRepository = userRepository;
    }

    @GetMapping("/location={id}")
    public ResponseEntity<List<Vehicle>> findVehiclesByLocationId(@PathVariable int id)
    {
        List<Vehicle> vehicles = vehicleService.findVehiclesByLocationId(id);
        return ResponseEntity.ok(vehicles);
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyVehicles(Principal principal) {
        try {
            String email = principal.getName();

            User currentUser = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Nie znaleziono użytkownika"));

            List<Vehicle> myVehicles = vehicleService.getVehiclesByClient(currentUser.getId());
            return ResponseEntity.ok(myVehicles);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Błąd autoryzacji: " + e.getMessage());
        }
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

    @PutMapping("/engine={vehicleId}")
    public ResponseEntity<?> specifyEngine(@PathVariable int vehicleId, @RequestBody String engineSpecification){
        try{
            Vehicle vehicle = vehicleService.specifyEngine(vehicleId, engineSpecification);
            if(vehicle != null){
                return ResponseEntity.ok(vehicle);
            }
        }catch(Exception e){
            return ResponseEntity.internalServerError().build();
        }
        return ResponseEntity.badRequest().build();
    }

    @PutMapping("/equipment={vehicleId}")
    public ResponseEntity<?> specifyEquipment(@PathVariable int vehicleId, @RequestBody Map<String, String> equipment){
        try{
            Vehicle vehicle = vehicleService.specifyEquipment(vehicleId, equipment);
            if(vehicle != null){
                return ResponseEntity.ok(vehicle);
            }
        }catch(Exception e){
            return ResponseEntity.internalServerError().build();
        }
        return ResponseEntity.badRequest().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteVehicleById(@PathVariable int id){
        return vehicleService.deleteById(id) ? ResponseEntity.ok().build() : ResponseEntity.badRequest().build();
    }
}
