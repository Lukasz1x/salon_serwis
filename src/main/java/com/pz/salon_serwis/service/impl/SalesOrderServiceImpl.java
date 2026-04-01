package com.pz.salon_serwis.service.impl;

import com.pz.salon_serwis.model.SalesOrder;
import com.pz.salon_serwis.model.SalesOrderItem;
import com.pz.salon_serwis.model.User;
import com.pz.salon_serwis.model.Vehicle;
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
        Optional<User> client = userRepository.findById(clientId);
        Optional<User> employee = userRepository.findById(employeeId);

        if (client.isPresent() && employee.isPresent()) {
            BigDecimal price = BigDecimal.ZERO;
            Set<SalesOrderItem> salesOrderItems = new HashSet<>();
            List<Vehicle> vehicles = new ArrayList<>();

            for(Integer vehicleId : vehicleIds){
                Optional<Vehicle> vehicle = vehicleRepository.findById(vehicleId);
                if(vehicle.isEmpty()){
                    return null;
                }
                if(!vehicle.get().getActive()){
                    return null;
                }
                price = price.add(vehicle.get().getMarginPrice());
                vehicles.add(vehicle.get());
            }

            SalesOrder salesOrder = new SalesOrder(client.get(), employee.get(), saleDate, price, true);
            for(Vehicle vehicle : vehicles){
                SalesOrderItem salesOrderItem = new SalesOrderItem(salesOrder, vehicle, vehicle.getMarginPrice(), true);
                salesOrderItems.add(salesOrderItem);
                vehicle.setClient(client.get());
            }

            salesOrder.setItems(salesOrderItems);
            salesOrderRepository.save(salesOrder);
            salesOrderItemRepository.saveAll(salesOrder.getItems());
            vehicleRepository.saveAll(vehicles);
            return salesOrder;
        }
        return null;
    }

    @Override
    public List<SalesOrder> getSalesOrdersBetweenDates(LocalDateTime beginDate, LocalDateTime endDate) {
        List<SalesOrder> salesOrders = new ArrayList<>();
        salesOrderRepository.findAllBySaleDateBetween(beginDate, endDate)
                .ifPresent(salesOrders::addAll);

        return salesOrders;
    }

}
