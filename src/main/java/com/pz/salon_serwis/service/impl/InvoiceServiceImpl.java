package com.pz.salon_serwis.service.impl;

import com.pz.salon_serwis.model.Invoice;
import com.pz.salon_serwis.model.User;
import com.pz.salon_serwis.repository.InvoiceRepository;
import com.pz.salon_serwis.repository.UserRepository;
import com.pz.salon_serwis.service.InvoiceService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

@Service
public class InvoiceServiceImpl implements InvoiceService {
    private final UserRepository userRepository;
    private final InvoiceRepository invoiceRepository;

    public InvoiceServiceImpl(UserRepository userRepository, InvoiceRepository invoiceRepository) {
        this.userRepository = userRepository;
        this.invoiceRepository = invoiceRepository;
    }

    @Override
    public Invoice generateInvoice(String id, int clientId, LocalDate dueDate, BigDecimal totalAmount) {
        Optional<User> client= userRepository.findById(clientId);
        if(client.isPresent())
        {
            Invoice invoice = new Invoice(id, client.get(), LocalDate.now(), dueDate, totalAmount, true);
            return invoiceRepository.save(invoice);
        }
        return null;
    }
}
