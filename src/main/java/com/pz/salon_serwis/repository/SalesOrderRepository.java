package com.pz.salon_serwis.repository;

import com.pz.salon_serwis.model.SalesOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface SalesOrderRepository extends JpaRepository<SalesOrder, Integer> {

    Optional<SalesOrder> findById(int id);
    void deleteById(int id);
}
