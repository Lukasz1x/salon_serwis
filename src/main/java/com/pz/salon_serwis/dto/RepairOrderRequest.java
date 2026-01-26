package com.pz.salon_serwis.dto;

public class RepairOrderRequest {
    private int appointmentId;

    public  RepairOrderRequest(int appointmentId) {
        this.appointmentId = appointmentId;
    }

    public int getAppointmentId() {
        return appointmentId;
    }

    public void setAppointmentId(int appointmentId) {
        this.appointmentId = appointmentId;
    }
}
