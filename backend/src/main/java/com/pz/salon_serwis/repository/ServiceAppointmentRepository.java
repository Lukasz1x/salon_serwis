package com.pz.salon_serwis.repository;

import com.pz.salon_serwis.model.ServiceAppointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ServiceAppointmentRepository extends JpaRepository<ServiceAppointment, Integer> {

    Optional<ServiceAppointment> findById(int id);
    void deleteById(int id);
    Optional<List<ServiceAppointment>> findAllByAppointmentDateBetween(LocalDateTime beginDate, LocalDateTime endDate);
    List<ServiceAppointment> findAllByLocationIdAndAppointmentDateBetween(int locationId, LocalDateTime beginDate, LocalDateTime endDate);
    List<ServiceAppointment> findAllByClientIdOrderByAppointmentDateDesc(Integer clientId);
}
