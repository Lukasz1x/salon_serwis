package com.pz.salon_serwis.controller;


import com.pz.salon_serwis.model.ServiceAppointment;
import com.pz.salon_serwis.model.ServiceStatus;
import com.pz.salon_serwis.service.RepairOrderService;
import com.pz.salon_serwis.service.ServiceAppointmentService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

@RestController
@RequestMapping("api/serviceReport")
public class ServiceReportController {
    private final ServiceAppointmentService serviceAppointmentService;
    private final RepairOrderService repairOrderService;

    @Autowired
    public ServiceReportController(ServiceAppointmentService serviceAppointmentService, RepairOrderService repairOrderService) {
        this.serviceAppointmentService = serviceAppointmentService;
        this.repairOrderService = repairOrderService;
    }

    // LocalDateTime? or change for string to parse? again
    @GetMapping("get/beginDate={beginDate}&endDate={endDate}")
    public ResponseEntity<?> getServiceReport(@PathVariable LocalDateTime beginDate, @PathVariable LocalDateTime endDate) {
        try {
            JSONObject response = new JSONObject();
            response.put("beginDate", beginDate);
            response.put("endDate", endDate);

            /*

                total costs?
                sum of prices from invoices
             */

            List<ServiceAppointment> serviceAppointments =  serviceAppointmentService.findAllByAppointmentDateBetween(beginDate, endDate);

            AtomicInteger counterOfScheduledRepairOrders = new AtomicInteger(0);
            AtomicInteger counterOfCompletedRepairOrders = new AtomicInteger(0);
            AtomicInteger counterOfCanceledRepairOrders = new AtomicInteger(0);

            serviceAppointments.forEach(serviceAppointment -> {
                ServiceStatus serviceStatus = serviceAppointment.getServiceStatus();
                if (serviceStatus == ServiceStatus.SCHEDULED) {
                    counterOfScheduledRepairOrders.incrementAndGet();
                }
                else if (serviceStatus == ServiceStatus.CONFIRMED) {
                    counterOfCompletedRepairOrders.incrementAndGet();
                }
                else {
                    counterOfCanceledRepairOrders.incrementAndGet();
                }
            });

            response.put("scheduledRepairOrders", counterOfScheduledRepairOrders.get());
            response.put("completedRepairOrders", counterOfCompletedRepairOrders.get());
            response.put("canceledRepairOrders", counterOfCanceledRepairOrders.get());

            return new ResponseEntity<>(response.toString(),HttpStatus.OK);
        } catch (Exception e){
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }

}
