package com.pz.salon_serwis.service.impl;

import com.pz.salon_serwis.model.RepairOrder;
import com.pz.salon_serwis.model.ServiceAppointment;
import com.pz.salon_serwis.model.User;
import com.pz.salon_serwis.repository.RepairOrderRepository;
import com.pz.salon_serwis.repository.ServiceAppointmentRepository;
import com.pz.salon_serwis.repository.UserRepository;
import com.pz.salon_serwis.service.RepairOrderService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class RepairOrderServiceImpl implements RepairOrderService {
    private final RepairOrderRepository repairOrderRepository;
    private final ServiceAppointmentRepository serviceAppointmentRepository;
    private final UserRepository userRepository;

    public RepairOrderServiceImpl(RepairOrderRepository repairOrderRepository,
                                  ServiceAppointmentRepository salonAppointmentRepository,
                                  UserRepository userRepository) {
        this.repairOrderRepository = repairOrderRepository;
        this.serviceAppointmentRepository = salonAppointmentRepository;
        this.userRepository = userRepository;

    }

    @Override
    public List<RepairOrder> getAll(){
        return repairOrderRepository.findAll();
    }

    @Override
    public RepairOrder generateRepairOrder(int appointmentId, int mechanicId){
        Optional<ServiceAppointment> serviceAppointment = serviceAppointmentRepository.findById(appointmentId);
        Optional<User> mechanic = userRepository.findById(mechanicId);

        if (serviceAppointment.isPresent() && mechanic.isPresent()){
            RepairOrder repairOrder = new RepairOrder(serviceAppointment.get(), mechanic.get(), new HashMap<>() , serviceAppointment.get().getAppointmentDate(),true);
            return  repairOrderRepository.save(repairOrder);
        }
        return null;
    }

    @Override
    public RepairOrder addWorkDescription(int repairOrderId, Map<String, BigDecimal> description) {
        Optional<RepairOrder> repairOrder = repairOrderRepository.findById(repairOrderId);
        if(repairOrder.isPresent()){
            repairOrder.get().setWorkDescription(description);
            return repairOrderRepository.save(repairOrder.get());
        }
        return null;
    }

    @Override
    public RepairOrder addFinalDate(int repairOrderId, LocalDateTime date) {
        Optional<RepairOrder> repairOrder = repairOrderRepository.findById(repairOrderId);
        if(repairOrder.isPresent()){
            repairOrder.get().setFinishedAt(date);
            return repairOrderRepository.save(repairOrder.get());
        }
        return null;
    }
}
