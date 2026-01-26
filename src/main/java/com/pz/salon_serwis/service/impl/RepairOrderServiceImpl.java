package com.pz.salon_serwis.service.impl;

import com.pz.salon_serwis.model.RepairOrder;
import com.pz.salon_serwis.model.ServiceAppointment;
import com.pz.salon_serwis.model.User;
import com.pz.salon_serwis.repository.RepairOrderRepository;
import com.pz.salon_serwis.repository.ServiceAppointmentRepository;
import com.pz.salon_serwis.repository.UserRepository;
import com.pz.salon_serwis.service.RepairOrderService;
import org.springframework.stereotype.Service;

import java.util.HashMap;
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
    public RepairOrder generateRepairOrder(int appointmentId, int mechanicId){
        Optional<ServiceAppointment> serviceAppointment = serviceAppointmentRepository.findById(appointmentId);
        Optional<User> mechanic = userRepository.findById(mechanicId);

        if (serviceAppointment.isPresent() && mechanic.isPresent()){
            RepairOrder repairOrder = new RepairOrder(serviceAppointment.get(), mechanic.get(), new HashMap<>() , serviceAppointment.get().getAppointmentDate(),true);
            return  repairOrderRepository.save(repairOrder);
        }
        return null;
    }
}
