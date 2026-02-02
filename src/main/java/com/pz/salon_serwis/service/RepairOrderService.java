package com.pz.salon_serwis.service;

import com.pz.salon_serwis.model.RepairOrder;
import org.springframework.web.bind.annotation.PathVariable;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;

public interface RepairOrderService {
    RepairOrder generateRepairOrder(int appointmentId, int mechanicId);
    RepairOrder addWorkDescription(int repairOrderId, Map<String, BigDecimal> description);
    RepairOrder addFinalDate(int repairOrderId, LocalDateTime date);
}
