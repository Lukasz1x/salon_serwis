package com.pz.salon_serwis.service;

import com.pz.salon_serwis.model.RepairOrder;

public interface RepairOrderService {
    RepairOrder generateRepairOrder(int appointmentId, int mechanicId);
}
