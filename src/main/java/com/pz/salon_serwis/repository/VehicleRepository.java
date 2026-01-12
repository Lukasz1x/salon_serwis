package com.pz.salon_serwis.repository;

import com.pz.salon_serwis.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Integer> {

    Optional<Vehicle> findById(int id);
    void addVehicle(Vehicle vehicle);
    void deleteById(int id);
}
