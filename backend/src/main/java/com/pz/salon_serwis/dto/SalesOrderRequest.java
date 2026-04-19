package com.pz.salon_serwis.dto;

import java.time.LocalDateTime;
import java.util.Set;

public class SalesOrderRequest {
    private int clientId;
    private Set<Integer> vehicleIds;
    private LocalDateTime saleDate;


    public SalesOrderRequest(int clientId, Set<Integer> vehicleIds, LocalDateTime saleDate) {
        this.clientId = clientId;
        this.vehicleIds = vehicleIds;
        this.saleDate = saleDate;
    }

    public int getClientId() {
        return clientId;
    }

    public void setClientId(int clientId) {
        this.clientId = clientId;
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
