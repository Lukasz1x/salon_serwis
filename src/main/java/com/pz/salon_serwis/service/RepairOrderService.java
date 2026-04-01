package com.pz.salon_serwis.service;

import com.pz.salon_serwis.model.RepairOrder;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public interface RepairOrderService {
    List<RepairOrder> getAll();
    RepairOrder generateRepairOrder(int appointmentId, int mechanicId);
    RepairOrder addWorkDescription(int repairOrderId, Map<String, BigDecimal> description);
    RepairOrder addFinalDate(int repairOrderId, LocalDateTime date);
}
