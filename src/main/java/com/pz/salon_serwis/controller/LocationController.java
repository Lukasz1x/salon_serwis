package com.pz.salon_serwis.controller;

import com.pz.salon_serwis.model.Location;
import com.pz.salon_serwis.service.LocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
