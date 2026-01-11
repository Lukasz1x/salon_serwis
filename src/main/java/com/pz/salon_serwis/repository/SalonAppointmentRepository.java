package com.pz.salon_serwis.repository;

import com.pz.salon_serwis.model.SalonAppointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SalonAppointmentRepository extends JpaRepository<SalonAppointment, Integer> {
}
