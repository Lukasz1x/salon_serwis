package com.pz.salon_serwis.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "service_appointments")
public class ServiceAppointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "client_id", nullable = false)
    private User client;

    @ManyToOne
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;

    @ManyToOne
    @JoinColumn(name = "location_id", nullable = false)
    private Location location;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private ServiceType serviceType;

    @Column(name = "issue_description")
    private String issueDescription;

    @Column(name = "appointment_date", nullable = false)
    private LocalDateTime appointmentDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ServiceStatus serviceStatus;

    @Column(name = "last_status_change")
    private LocalDateTime lastStatusChange;

    @Column(columnDefinition = "BOOLEAN", name = "is_active", nullable = false)
    private boolean isActive;

    @PrePersist
    protected void onCreate() {
        this.serviceStatus = ServiceStatus.SCHEDULED;
        this.isActive = true;
    }

    public ServiceAppointment() {}

    public ServiceAppointment(Integer id, User client, Vehicle vehicle, Location location, ServiceType serviceType, LocalDateTime appointmentDate, ServiceStatus serviceStatus, boolean isActive) {
        this.id = id;
        this.client = client;
        this.vehicle = vehicle;
        this.location = location;
        this.serviceType = serviceType;
        this.appointmentDate = appointmentDate;
        this.serviceStatus = serviceStatus;
        this.isActive = isActive;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public User getClient() {
        return client;
    }

    public void setClient(User client) {
        this.client = client;
    }

    public Vehicle getVehicle() {
        return vehicle;
    }

    public void setVehicle(Vehicle vehicle) {
        this.vehicle = vehicle;
    }

    public Location getLocation() {
        return location;
    }

    public void setLocation(Location location) {
        this.location = location;
    }

    public ServiceType getServiceType() {
        return serviceType;
    }

    public void setServiceType(ServiceType serviceType) {
        this.serviceType = serviceType;
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

    public ServiceStatus getServiceStatus() {
        return serviceStatus;
    }

    public void setServiceStatus(ServiceStatus serviceStatus) {
        this.serviceStatus = serviceStatus;
    }

    public LocalDateTime getLastStatusChange() {
        return lastStatusChange;
    }

    public void setLastStatusChange(LocalDateTime lastStatusChange) {
        this.lastStatusChange = lastStatusChange;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }
}
