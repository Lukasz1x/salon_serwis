package com.pz.salon_serwis.repository;

import com.pz.salon_serwis.model.ServiceAppointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ServiceAppointmentRepository extends JpaRepository<ServiceAppointment, Integer> {
}
