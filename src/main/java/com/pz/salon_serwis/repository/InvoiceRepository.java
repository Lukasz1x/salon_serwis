package com.pz.salon_serwis.repository;

import com.pz.salon_serwis.model.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, String> {

    //TODO usunąć optional? jest tu na razie tylko dlatego, żeby nie sypało błędami
    Optional<Invoice> findById(String id);
    void addInvoice(Invoice invoice);
    void deleteById(String id);
}
