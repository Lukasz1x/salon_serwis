package com.pz.salon_serwis.service.impl;

import com.pz.salon_serwis.model.SalesOrder;
import com.pz.salon_serwis.model.User;
import com.pz.salon_serwis.repository.SalesOrderRepository;
import com.pz.salon_serwis.repository.UserRepository;
import com.pz.salon_serwis.service.SalesOrderService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class SalesOrderServiceImpl implements SalesOrderService {
    private final UserRepository userRepository;
    private final SalesOrderRepository salesOrderRepository;

    public SalesOrderServiceImpl(UserRepository userRepository,
                                 SalesOrderRepository salesOrderRepository) {
        this.userRepository = userRepository;
        this.salesOrderRepository = salesOrderRepository;
    }

    @Override
    public SalesOrder generateSalesOrder(int clientId, int employeeId, LocalDateTime saleDate, BigDecimal price) {
        Optional<User> user = userRepository.findById(clientId);
        Optional<User> employee = userRepository.findById(employeeId);

        if (user.isPresent() && employee.isPresent()) {
            SalesOrder salesOrder = new SalesOrder(user.get(), employee.get(), saleDate, price, true);
            return salesOrderRepository.save(salesOrder);
        }
        return null;
    }
}
