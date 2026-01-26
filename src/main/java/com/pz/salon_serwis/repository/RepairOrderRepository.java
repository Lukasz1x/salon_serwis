package com.pz.salon_serwis.repository;

import com.pz.salon_serwis.model.RepairOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface RepairOrderRepository extends JpaRepository<RepairOrder, Integer> {

    Optional<RepairOrder> findById(int id);

    @Query("SELECT r FROM RepairOrder r WHERE r.serviceAppointment.id = ?1")
    Optional<RepairOrder> findByServiceAppointmentId(int id);
    void deleteById(int id);
    Optional<List<RepairOrder>> findAllByOrderedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
}
