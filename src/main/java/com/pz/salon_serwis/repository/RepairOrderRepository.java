package com.pz.salon_serwis.repository;

import com.pz.salon_serwis.model.RepairOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface RepairOrderRepository extends JpaRepository<RepairOrder, Integer> {

    Optional<RepairOrder> findById(int id);
    void deleteById(int id);
}
