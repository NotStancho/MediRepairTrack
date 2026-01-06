package ua.nure.medirepairtrack.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ua.nure.medirepairtrack.Entity.Payment.Payment;
import ua.nure.medirepairtrack.Entity.Payment.PaymentStatus;

import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Integer> {

    List<Payment> findByInvoiceId(Integer invoiceId);

    List<Payment> findByStatus(PaymentStatus status);
}
