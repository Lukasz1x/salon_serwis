package com.pz.salon_serwis.repository;

import com.pz.salon_serwis.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Integer> {

    Vehicle findById(int id);
    void addVehicle(Vehicle vehicle);
    void deleteById(int id);
}
