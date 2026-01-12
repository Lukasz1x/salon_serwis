package com.pz.salon_serwis.repository;

import com.pz.salon_serwis.model.SalonAppointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface SalonAppointmentRepository extends JpaRepository<SalonAppointment, Integer> {

    Optional<SalonAppointment> findById(int id);
    void addSalonAppointment(SalonAppointment salonAppointment);
    void deleteById(int id);
}
