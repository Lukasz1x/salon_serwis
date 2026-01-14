package com.pz.salon_serwis.dto;

import com.pz.salon_serwis.model.ServiceType;
import java.time.LocalDateTime;

public class ServiceAppointmentRequest {
    private int clientId;
    private int vehicleId;
    private int locationId;
    private ServiceType type;
    private String issueDescription;
    private LocalDateTime appointmentDate;

    public ServiceAppointmentRequest(int clientId, int vehicleId, int locationId, String issueDescription, ServiceType type, LocalDateTime appointmentDate) {
        this.clientId = clientId;
        this.vehicleId = vehicleId;
        this.locationId = locationId;
        this.issueDescription = issueDescription;
        this.type = type;
        this.appointmentDate = appointmentDate;
    }

    public int getClientId() {
        return clientId;
    }

    public void setClientId(int clientId) {
        this.clientId = clientId;
    }

    public int getVehicleId() {
        return vehicleId;
    }

    public void setVehicleId(int vehicleId) {
        this.vehicleId = vehicleId;
    }

    public ServiceType getType() {
        return type;
    }

    public void setType(ServiceType type) {
        this.type = type;
    }

    public int getLocationId() {
        return locationId;
    }

    public void setLocationId(int locationId) {
        this.locationId = locationId;
    }

    public String getIssueDescription() {
        return issueDescription;
    }

    public void setIssueDescription(String issueDescription) {
        this.issueDescription = issueDescription;
    }

    public LocalDateTime getAppointmentDate() {
        return appointmentDate;
    }

    public void setAppointmentDate(LocalDateTime appointmentDate) {
        this.appointmentDate = appointmentDate;
    }
}
