package com.pz.salon_serwis.service.impl;

import com.pz.salon_serwis.model.*;
import com.pz.salon_serwis.repository.*;
import com.pz.salon_serwis.service.InvoiceService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

@Service
public class InvoiceServiceImpl implements InvoiceService {
    private final UserRepository userRepository;
    private final ServiceAppointmentRepository serviceAppointmentRepository;

    private final SalesOrderRepository salesOrderRepository;
    private final RepairOrderRepository repairOrderRepository;
    private final InvoiceRepository invoiceRepository;

    public InvoiceServiceImpl(UserRepository userRepository, ServiceAppointmentRepository serviceAppointmentRepository, SalesOrderRepository salesOrderRepository, RepairOrderRepository repairOrderRepository, InvoiceRepository invoiceRepository) {
        this.userRepository = userRepository;
        this.serviceAppointmentRepository = serviceAppointmentRepository;
        this.salesOrderRepository = salesOrderRepository;
        this.repairOrderRepository = repairOrderRepository;
        this.invoiceRepository = invoiceRepository;
    }

    @Override
    @Transactional
    public Invoice generateSaleInvoice(String id, int clientId, int saleOrderId, LocalDate dueDate, BigDecimal totalAmount) {
        Optional<SalesOrder> salesOrder = salesOrderRepository.findById(saleOrderId);
        Optional<User> client = userRepository.findById(clientId);

        if(salesOrder.isPresent() && client.isPresent()){
            Invoice invoice = new Invoice(id, client.get(), LocalDate.now(), dueDate, totalAmount, salesOrder.get(), true);
            return invoiceRepository.save(invoice);
        }
        return null;
    }

    @Override
    @Transactional
    public Invoice generateRepairInvoice(String id, int serviceAppointmentId, LocalDate dueDate, BigDecimal totalAmount) {
        Optional<ServiceAppointment> serviceAppointment = serviceAppointmentRepository.findById(serviceAppointmentId);

        if(serviceAppointment.isPresent()){
            Optional<User> client = userRepository.findById(serviceAppointment.get().getClient().getId());
            Optional<RepairOrder> repairOrder = repairOrderRepository.findByServiceAppointmentId(serviceAppointment.get().getId());
            System.out.println("============");
            System.out.println(repairOrder.isPresent());
            System.out.println("============");
            if(client.isPresent() && repairOrder.isPresent()){
                Invoice invoice = new Invoice(id, client.get(), LocalDate.now(), dueDate, totalAmount, repairOrder.get(), true);
                return invoiceRepository.save(invoice);
            }
        }
        return null;
    }
}
