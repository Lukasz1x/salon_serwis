package com.pz.salon_serwis.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;

@Entity
@Table(name = "repair_orders")
public class RepairOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "appointment_id", nullable = false)
    private ServiceAppointment serviceAppointment;

    @ManyToOne
    @JoinColumn(name = "mechanic_id", nullable = false)
    private User mechanic;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb", name = "work_description", nullable = false)
    private Map<String, BigDecimal> workDescription;

    @Column(name = "ordered_at", nullable = false)
    private LocalDateTime orderedAt;

    @Column(name = "finished_at")
    private LocalDateTime finishedAt;

    @Column(columnDefinition = "BOOLEAN", name = "is_active", nullable = false)
    private boolean isActive;

    @PrePersist
    protected void onCreate() {
        this.orderedAt = LocalDateTime.now();
        this.isActive = true;
    }

    public RepairOrder() {}

    public RepairOrder(ServiceAppointment serviceAppointment, User mechanic, Map<String, BigDecimal> workDescription, LocalDateTime orderedAt, boolean isActive) {
        this.serviceAppointment = serviceAppointment;
        this.mechanic = mechanic;
        this.workDescription = workDescription;
        this.orderedAt = orderedAt;
        this.isActive = isActive;
    }

    @JsonProperty("appointmentId")
    public Integer getAppointmentIdForJson() {
        return this.serviceAppointment != null ? this.serviceAppointment.getId() : null;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public ServiceAppointment getServiceAppointment() {
        return serviceAppointment;
    }

    public void setServiceAppointment(ServiceAppointment serviceAppointment) {
        this.serviceAppointment = serviceAppointment;
    }

    public User getMechanic() {
        return mechanic;
    }

    public void setMechanic(User mechanic) {
        this.mechanic = mechanic;
    }

    public Map<String, BigDecimal> getWorkDescription() {
        return workDescription;
    }

    public void setWorkDescription(Map<String, BigDecimal> workDescription) {
        this.workDescription = workDescription;
    }

    public LocalDateTime getOrderedAt() {
        return orderedAt;
    }

    public void setOrderedAt(LocalDateTime orderedAt) {
        this.orderedAt = orderedAt;
    }

    public LocalDateTime getFinishedAt() {
        return finishedAt;
    }

    public void setFinishedAt(LocalDateTime finishedAt) {
        this.finishedAt = finishedAt;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }
}
