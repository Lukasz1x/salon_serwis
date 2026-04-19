package com.pz.salon_serwis.service;

import com.pz.salon_serwis.model.SalesOrder;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

public interface SalesOrderService {
    List<SalesOrder> getAll();
    SalesOrder generateSalesOrder(int clientId, int employeeId, Set<Integer> vehicleIds, LocalDateTime saleDate);
    List<SalesOrder> getSalesOrdersBetweenDates(LocalDateTime saleDate, LocalDateTime endDate);
}
