package com.pz.salon_serwis.repository;

import com.pz.salon_serwis.model.ServiceAppointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ServiceAppointmentRepository extends JpaRepository<ServiceAppointment, Integer> {

    Optional<ServiceAppointment> findById(int id);
    void addServiceAppointment(ServiceAppointment serviceAppointment);
    void deleteById(int id);
}
