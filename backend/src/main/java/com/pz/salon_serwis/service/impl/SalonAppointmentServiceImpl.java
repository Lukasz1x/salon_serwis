package com.pz.salon_serwis.service.impl;


import com.pz.salon_serwis.model.*;
import com.pz.salon_serwis.repository.LocationRepository;
import com.pz.salon_serwis.repository.SalonAppointmentRepository;
import com.pz.salon_serwis.repository.UserRepository;
import com.pz.salon_serwis.repository.VehicleRepository;
import com.pz.salon_serwis.service.SalonAppointmentService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class SalonAppointmentServiceImpl implements SalonAppointmentService {
    private final UserRepository userRepository;
    private final SalonAppointmentRepository salonAppointmentRepository;
    private final LocationRepository locationRepository;
    private final VehicleRepository vehicleRepository;

    public SalonAppointmentServiceImpl(UserRepository userRepository, SalonAppointmentRepository salonAppointmentRepository, LocationRepository locationRepository, VehicleRepository vehicleRepository) {
        this.userRepository = userRepository;
        this.salonAppointmentRepository = salonAppointmentRepository;
        this.locationRepository = locationRepository;
        this.vehicleRepository = vehicleRepository;
    }

    @Override
    public List<SalonAppointment> getAll(){
        return salonAppointmentRepository.findAll();
    }

    @Override
    @Transactional
    public SalonAppointment arrangeAppointment(int clientId, int employeeId, int locationId, Integer vehicleId,
                                               SalonAppointmentType type, LocalDateTime appointmentDate, String notes) {
        Optional<User> client= userRepository.findById(clientId);
        Optional<User> employee= userRepository.findById(employeeId);
        Optional<Location> location = locationRepository.findById(locationId);

        if(client.isPresent() && employee.isPresent() && location.isPresent()){
            if(employee.get().isActive() && location.get().isActive()){
                SalonAppointment salonAppointment = new SalonAppointment(client.get(), employee.get(), location.get(),
                        appointmentDate, type, SalonAppointmentStatus.SCHEDULED, true);
                salonAppointment.setNotes(notes);
                if(vehicleId!=null)
                {
                    Optional<Vehicle> vehicle = vehicleRepository.findById(vehicleId);
                    vehicle.ifPresent(salonAppointment::setVehicle);
                }else
                {
                    salonAppointment.setVehicle(null);
                }
                return salonAppointmentRepository.save(salonAppointment);
            }
        }
        return null;
    }

    @Override
    public SalonAppointment changeStatus(int salonAppointmentId, String status) {
        Optional<SalonAppointment> salonAppointment = salonAppointmentRepository.findById(salonAppointmentId);
        if(salonAppointment.isPresent()){
            salonAppointment.get().setStatus(SalonAppointmentStatus.valueOf(status));
            salonAppointment.get().setLastStatusChange(LocalDateTime.now());
            return salonAppointmentRepository.save(salonAppointment.get());
        }
        return null;
    }

    @Override
    public List<SalonAppointment> getSalonAppointmentsBetween(LocalDateTime startDate, LocalDateTime endDate) {
        List<SalonAppointment> salonAppointments = new ArrayList<>();
        salonAppointmentRepository.findAllByAppointmentDateBetween(startDate, endDate)
                .ifPresent(salonAppointments::addAll);
        return salonAppointments;
    }

    @Override
    public List<SalonAppointment> getAppointmentsByLocationAndDate(int locationId, LocalDate date) {
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(LocalTime.MAX);
        return salonAppointmentRepository.findAllByLocationIdAndAppointmentDateBetween(locationId, startOfDay, endOfDay);
    }
}
