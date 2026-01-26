package com.pz.salon_serwis.dto;

import java.time.LocalDateTime;
import java.util.Set;

public class SalesOrderRequest {
    private int employeeId;
    private int clientId;
    private Set<Integer> vehicleIds;
    private LocalDateTime saleDate;


    public SalesOrderRequest(int clientId, int employeeId, Set<Integer> vehicleIds, LocalDateTime saleDate) {
        this.clientId = clientId;
        this.employeeId = employeeId;
        this.vehicleIds = vehicleIds;
        this.saleDate = saleDate;
    }

    public int getClientId() {
        return clientId;
    }

    public void setClientId(int clientId) {
        this.clientId = clientId;
    }

    public int getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(int employeeId) {
        this.employeeId = employeeId;
    }

    public Set<Integer> getVehiclesIds() {
        return vehicleIds;
    }

    public void setVehiclesIds(Set<Integer> vehiclesIds) {
        this.vehicleIds = vehiclesIds;
    }

    public LocalDateTime getSaleDate() {
        return saleDate;
    }

    public void setSaleDate(LocalDateTime saleDate) {
        this.saleDate = saleDate;
    }
}
