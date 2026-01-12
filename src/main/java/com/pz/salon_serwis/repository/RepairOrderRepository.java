package com.pz.salon_serwis.repository;

import com.pz.salon_serwis.model.RepairOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RepairOrderRepository extends JpaRepository<RepairOrder, Integer> {

    RepairOrder findById(int id);
    void addRepairOrder(RepairOrder repairOrder);
    void deleteById(int id);
}
