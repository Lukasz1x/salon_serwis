package com.pz.salon_serwis.repository;

import com.pz.salon_serwis.model.SalonAppointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface SalonAppointmentRepository extends JpaRepository<SalonAppointment, Integer> {

    Optional<SalonAppointment> findById(int id);
    void deleteById(int id);
    Optional<List<SalonAppointment>> findAllByAppointmentDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    List<SalonAppointment> findAllByLocationIdAndAppointmentDateBetween(int locationId, LocalDateTime startDate, LocalDateTime endDate);
}
