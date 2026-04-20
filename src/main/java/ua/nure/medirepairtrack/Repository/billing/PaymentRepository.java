package ua.nure.medirepairtrack.Repository.billing;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ua.nure.medirepairtrack.Entity.billing.Payment.Payment;

import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Integer> {

    List<Payment> findByInvoiceIdOrderByCreatedAtDesc(Integer invoiceId);

    @Query("""
        select p
        from Payment p
        join fetch p.invoice i
        join fetch i.claim c
        join fetch c.client cl
        order by p.createdAt desc
    """)
    List<Payment> findAllViewData();

    @Query("""
        select p
        from Payment p
        join fetch p.invoice i
        join fetch i.claim c
        join fetch c.client cl
        where cl.id = :clientId
        order by p.createdAt desc
    """)
    List<Payment> findAllViewDataByClientId(@Param("clientId") Integer clientId);

    @Query("""
        select p
        from Payment p
        join fetch p.invoice i
        join fetch i.claim c
        join fetch c.client cl
        where p.id = :paymentId
    """)
    Optional<Payment> findViewDataById(@Param("paymentId") Integer paymentId);
}
