package com.pz.salon_serwis.dto;

public class RepairOrderRequest {
    private int appointmentId;
    private int mechanicId;

    public  RepairOrderRequest(int appointmentId, int mechanicId) {
        this.appointmentId = appointmentId;
        this.mechanicId = mechanicId;
    }

    public int getAppointmentId() {
        return appointmentId;
    }

    public void setAppointmentId(int appointmentId) {
        this.appointmentId = appointmentId;
    }

    public int getMechanicId() {
        return mechanicId;
    }

    public void setMechanicId(int mechanicId) {
        this.mechanicId = mechanicId;
    }
}
