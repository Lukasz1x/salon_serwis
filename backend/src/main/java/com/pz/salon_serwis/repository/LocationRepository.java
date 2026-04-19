package com.pz.salon_serwis.repository;

import com.pz.salon_serwis.model.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.Optional;

@Repository
public interface LocationRepository extends JpaRepository<Location, Integer> {

    Optional<Location> findById(int id);
    Optional<Location> findByLongitudeAndLatitude(BigDecimal longitude, BigDecimal latitude);
    void deleteById(int id);
}
