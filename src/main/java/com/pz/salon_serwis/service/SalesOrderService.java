package com.pz.salon_serwis.service;

import com.pz.salon_serwis.model.SalesOrder;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface SalesOrderService {
    SalesOrder generateSalesOrder(int clientId, int employeeId, LocalDateTime saleDate, BigDecimal price);
    List<SalesOrder> getSalesOrdersBetweenDates(LocalDateTime saleDate, LocalDateTime endDate);
}
