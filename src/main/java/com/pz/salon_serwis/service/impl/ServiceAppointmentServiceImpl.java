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
    @Transactional
    public ServiceAppointment arrangeService(int clientId, int vehicleId, int locationId,
                                              ServiceType type, String issueDescription,
                                              LocalDateTime appointmentDate) {
        Optional<User> client = userRepository.findById(clientId);
        Optional<Vehicle> vehicle = vehicleRepository.findById(vehicleId);
        Optional<Location> location = locationRepository.findById(locationId);

        if(client.isPresent() && vehicle.isPresent() && location.isPresent())
        {
            //(User client, Vehicle vehicle, Location location, ServiceType serviceType, LocalDateTime appointmentDate, ServiceStatus serviceStatus, boolean isActive)
            ServiceAppointment serviceAppointment = new ServiceAppointment();
            serviceAppointment.setClient(client.get());
            serviceAppointment.setVehicle(vehicle.get());
            serviceAppointment.setLocation(location.get());
            serviceAppointment.setServiceType(type);
            serviceAppointment.setIssueDescription(issueDescription);
            serviceAppointment.setAppointmentDate(appointmentDate);
            serviceAppointment.setServiceStatus(ServiceStatus.SCHEDULED);
            serviceAppointment.setActive(true);
            serviceAppointment.setLastStatusChange(LocalDateTime.now());
            return serviceAppointmentRepository.save(serviceAppointment);

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
