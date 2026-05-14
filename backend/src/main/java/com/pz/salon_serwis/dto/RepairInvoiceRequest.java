package com.pz.salon_serwis.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class RepairInvoiceRequest {
    private String id;
    private int appointmentId;
    private LocalDate dueDate;

    public RepairInvoiceRequest(String id, int appointmentId, LocalDate dueDate) {
        this.id = id;
        this.appointmentId = appointmentId;
        this.dueDate = dueDate;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public int getAppointmentId() {
        return appointmentId;
    }

    public void setAppointmentId(int appointmentId) {
        this.appointmentId = appointmentId;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

}
