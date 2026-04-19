package com.pz.salon_serwis.dto;

import com.pz.salon_serwis.model.SalonAppointmentType;
import java.time.LocalDateTime;

public class SalonAppointmentRequest {
    private int employeeId;
    private int locationId;
    private Integer vehicleId;
    private SalonAppointmentType type;
    private LocalDateTime appointmentDate;
    private String notes;

    public SalonAppointmentRequest(int locationId, int employeeId, Integer vehicleId, SalonAppointmentType type, LocalDateTime appointmentDate, String notes) {
        this.locationId = locationId;
        this.employeeId = employeeId;
        this.vehicleId = vehicleId;
        this.type = type;
        this.appointmentDate = appointmentDate;
        this.notes = notes;
    }

    public int getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(int employeeId) {
        this.employeeId = employeeId;
    }

    public int getLocationId() {
        return locationId;
    }

    public void setLocationId(int locationId) {
        this.locationId = locationId;
    }

    public Integer getVehicleId() {
        return vehicleId;
    }

    public void setVehicleId(Integer vehicleId) {
        this.vehicleId = vehicleId;
    }

    public SalonAppointmentType getType() {
        return type;
    }

    public void setType(SalonAppointmentType type) {
        this.type = type;
    }

    public LocalDateTime getAppointmentDate() {
        return appointmentDate;
    }

    public void setAppointmentDate(LocalDateTime appointmentDate) {
        this.appointmentDate = appointmentDate;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
