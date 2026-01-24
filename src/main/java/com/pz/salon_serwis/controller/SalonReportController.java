package com.pz.salon_serwis.controller;

import com.pz.salon_serwis.model.SalesOrder;
import com.pz.salon_serwis.model.SalonAppointment;
import com.pz.salon_serwis.service.SalesOrderService;
import com.pz.salon_serwis.service.SalonAppointmentService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.atomic.AtomicReference;

@RestController
@RequestMapping("api/salonReport")
public class SalonReportController {
    private final SalonAppointmentService salonAppointmentService;
    private final SalesOrderService salonOrderService;

    @Autowired
    public SalonReportController(SalonAppointmentService salonAppointmentService,
                                 SalesOrderService salonOrderService) {
     this.salonAppointmentService = salonAppointmentService;
        this.salonOrderService = salonOrderService;
    }

    // LocalDateTime? or change for string to parse?
    @GetMapping("get/beginDate={beginDate}&endDate={endDate}")
    public ResponseEntity<?> getSalonReport(@PathVariable LocalDateTime beginDate, @PathVariable LocalDateTime endDate) {
        try {
        JSONObject response = new JSONObject();

        response.put("beginDate", beginDate);
        response.put("endDate", endDate);

        /*
          countOfIndividual appointments
          Top 3 of most purchased vehicles
          Top 3 of location by sales
          */
        List<SalesOrder> salonOrders = salonOrderService.getSalesOrdersBetweenDates(beginDate, endDate);
        List<SalonAppointment> salonAppointments = salonAppointmentService.getSalonAppointmentsBetween(beginDate, endDate);

        AtomicReference<BigDecimal> countOfSalesOrders = new AtomicReference<>(BigDecimal.ZERO);
        AtomicReference<BigDecimal> sumOfFinalPrices = new AtomicReference<>(BigDecimal.ZERO);
        AtomicReference<Integer> countOfAppointments = new AtomicReference<>(0);


        salonOrders.forEach(salesOrder -> {
            BigDecimal currentCount = countOfSalesOrders.get();
            countOfSalesOrders.compareAndSet(currentCount, currentCount.add(BigDecimal.ONE));

            BigDecimal currentPrice = sumOfFinalPrices.get();
            countOfSalesOrders.compareAndSet(currentPrice, currentPrice.add(salesOrder.getFinalPrice()));
        });

        salonAppointments.forEach(salonAppointment -> {
            Integer currentCount = countOfAppointments.get();
            countOfAppointments.compareAndSet(currentCount, ++currentCount);

        });

        response.put("countOfSalesOrders", countOfSalesOrders.get());
        response.put("sumOfFinalPrices", sumOfFinalPrices.get());
        response.put("salonAppointments", salonAppointments);

        // or without toString
        return new ResponseEntity<>(response.toString(), HttpStatus.OK);
        } catch (Exception e){
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }
}
