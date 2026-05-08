package com.pz.salon_serwis.service.impl;

import com.pz.salon_serwis.model.*;
import com.pz.salon_serwis.repository.SalesOrderItemRepository;
import com.pz.salon_serwis.repository.SalesOrderRepository;
import com.pz.salon_serwis.repository.UserRepository;
import com.pz.salon_serwis.repository.VehicleRepository;
import com.pz.salon_serwis.service.SalesOrderService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class SalesOrderServiceImpl implements SalesOrderService {
    private final UserRepository userRepository;
    private final SalesOrderRepository salesOrderRepository;
    private final SalesOrderItemRepository salesOrderItemRepository;
    private final VehicleRepository vehicleRepository;

    public SalesOrderServiceImpl(UserRepository userRepository, SalesOrderRepository salesOrderRepository, SalesOrderItemRepository salesOrderItemRepository, VehicleRepository vehicleRepository) {
        this.userRepository = userRepository;
        this.salesOrderRepository = salesOrderRepository;
        this.salesOrderItemRepository = salesOrderItemRepository;
        this.vehicleRepository = vehicleRepository;
    }

    @Override
    public List<SalesOrder> getAll(){
        return salesOrderRepository.findAll();
    }

    @Override
    @Transactional
    public SalesOrder generateSalesOrder(int clientId, int employeeId, Set<Integer> vehicleIds, LocalDateTime saleDate) {
        // Zamiast Optional.isPresent() używamy orElseThrow - jeśli nie ma, od razu przerywa i krzyczy
        User client = userRepository.findById(clientId)
                .orElseThrow(() -> new IllegalArgumentException("Client not found in the database."));
        User employee = userRepository.findById(employeeId)
                .orElseThrow(() -> new IllegalArgumentException("Employee not found in the database."));

        BigDecimal price = BigDecimal.ZERO;
        Set<SalesOrderItem> salesOrderItems = new HashSet<>();
        List<Vehicle> vehicles = new ArrayList<>();

        for(Integer vehicleId : vehicleIds){
            Vehicle vehicle = vehicleRepository.findById(vehicleId)
                    .orElseThrow(() -> new IllegalArgumentException("Vehicle ID " + vehicleId + "not found."));

            if(!vehicle.getActive()){
                throw new IllegalArgumentException("Vehicle ID " + vehicleId + " is inactive and cannot be sold!");
            }

            if(vehicle.getMarginPrice() == null) {
                throw new IllegalArgumentException("Vehicle ID " + vehicleId + " has no set price!");
            }
            price = price.add(vehicle.getMarginPrice());
            vehicles.add(vehicle);
        }

        SalesOrder salesOrder = new SalesOrder(client, employee, saleDate, price, true);
        salesOrderRepository.save(salesOrder);

        for(Vehicle vehicle : vehicles){
            SalesOrderItem salesOrderItem = new SalesOrderItem(salesOrder, vehicle, vehicle.getMarginPrice(), true);
            salesOrderItems.add(salesOrderItem);
            vehicle.setClient(client);
            vehicle.setStatus(VehicleStatus.SOLD);
        }

        salesOrder.setItems(salesOrderItems);
        salesOrderItemRepository.saveAll(salesOrderItems);
        vehicleRepository.saveAll(vehicles);

        return salesOrder;
    }

    @Override
    public List<SalesOrder> getSalesOrdersBetweenDates(LocalDateTime beginDate, LocalDateTime endDate) {
        List<SalesOrder> salesOrders = new ArrayList<>();
        salesOrderRepository.findAllBySaleDateBetween(beginDate, endDate)
                .ifPresent(salesOrders::addAll);

        return salesOrders;
    }

}
