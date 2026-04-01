package com.pz.salon_serwis.service.impl;

import com.pz.salon_serwis.model.*;
import com.pz.salon_serwis.repository.LocationRepository;
import com.pz.salon_serwis.repository.ServiceAppointmentRepository;
import com.pz.salon_serwis.repository.UserRepository;
import com.pz.salon_serwis.repository.VehicleRepository;
import com.pz.salon_serwis.service.ServiceAppointmentService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ServiceAppointmentServiceImpl implements ServiceAppointmentService {
    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;
    private final LocationRepository locationRepository;
    private final ServiceAppointmentRepository serviceAppointmentRepository;

    public ServiceAppointmentServiceImpl(UserRepository userRepository, VehicleRepository vehicleRepository, LocationRepository locationRepository, ServiceAppointmentRepository serviceAppointmentRepository) {
        this.userRepository = userRepository;
        this.vehicleRepository = vehicleRepository;
        this.locationRepository = locationRepository;
        this.serviceAppointmentRepository = serviceAppointmentRepository;
    }

    @Override
    public List<ServiceAppointment> getAll(){
        return serviceAppointmentRepository.findAll();
    }

    @Override
    @Transactional
    public ServiceAppointment arrangeService(int clientId, int vehicleId, int locationId,
                                              ServiceType type, String issueDescription,
                                              LocalDateTime appointmentDate) {
        Optional<User> client = userRepository.findById(clientId);
        Optional<Vehicle> vehicle = vehicleRepository.findById(vehicleId);
        Optional<Location> location = locationRepository.findById(locationId);

        if(client.isPresent() && vehicle.isPresent() && location.isPresent()){
            if(vehicle.get().getActive() && location.get().isActive()){
                ServiceAppointment serviceAppointment = new ServiceAppointment(client.get(), vehicle.get(), location.get(), type, appointmentDate, ServiceStatus.SCHEDULED, true);
                serviceAppointment.setIssueDescription(issueDescription);
                serviceAppointment.setLastStatusChange(LocalDateTime.now());
                return serviceAppointmentRepository.save(serviceAppointment);
            }
        }
        return null;

    }

    @Override
    public ServiceAppointment changeStatus(int serviceAppointmentId, String status) {
        Optional<ServiceAppointment> serviceAppointment = serviceAppointmentRepository.findById(serviceAppointmentId);
        if(serviceAppointment.isPresent()){
            serviceAppointment.get().setServiceStatus(ServiceStatus.valueOf(status));
            serviceAppointment.get().setLastStatusChange(LocalDateTime.now());
            return serviceAppointmentRepository.save(serviceAppointment.get());
        }
        return null;
    }

    @Override
    public List<ServiceAppointment> findAllByAppointmentDateBetween(LocalDateTime beginDate, LocalDateTime endDate) {
        List<ServiceAppointment> serviceAppointments = new ArrayList<>();
        serviceAppointmentRepository.findAllByAppointmentDateBetween(beginDate, endDate)
                .ifPresent(serviceAppointments::addAll);
        return serviceAppointments;
    }
}
