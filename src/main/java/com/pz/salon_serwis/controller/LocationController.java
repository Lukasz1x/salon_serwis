package com.pz.salon_serwis.controller;

import com.pz.salon_serwis.dto.LocationRequest;
import com.pz.salon_serwis.model.Location;
import com.pz.salon_serwis.service.LocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("api/location")
public class LocationController {
    private final LocationService locationService;

    @Autowired
    public LocationController(LocationService locationService) {
        this.locationService = locationService;
    }

    @GetMapping("locationId={locationId}")
    public ResponseEntity<?> getLocation(@PathVariable("locationId") int locationId){
        try{
            Location location = locationService.findById(locationId);
            if(location == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(location);
        } catch (Exception e){
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("longitude={longitude}&latitude={latitude}")
    public ResponseEntity<?> getLocation(@PathVariable("longitude") BigDecimal longitude, @PathVariable("latitude") BigDecimal latitude){
        try{
            Location location = locationService.findByLongLat(longitude, latitude);
            if(location == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(location);
        } catch(Exception e){
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/add")
    public ResponseEntity<?> addLocation(@RequestBody LocationRequest locationRequest){
        try{
            Location location = locationService.addLocation(
                    locationRequest.getName(),
                    locationRequest.getPhone(),
                    locationRequest.getStreet(),
                    locationRequest.getCity(),
                    locationRequest.getZipCode(),
                    locationRequest.getLatitude(),
                    locationRequest.getLongitude(),
                    locationRequest.getLocationType());
            if(location != null){
                return ResponseEntity.ok(location);
            }
        }catch (Exception e){
            return ResponseEntity.internalServerError().build();
        }
        return ResponseEntity.badRequest().build();
    }
}
