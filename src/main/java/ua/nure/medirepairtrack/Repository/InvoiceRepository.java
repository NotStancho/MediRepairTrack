package ua.nure.medirepairtrack.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import ua.nure.medirepairtrack.Entity.Invoice.Invoice;
import ua.nure.medirepairtrack.Entity.Invoice.InvoiceStatus;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface InvoiceRepository extends JpaRepository<Invoice, Integer> {
    List<Invoice> findAllByOrderByCreatedAtDesc();

    Optional<Invoice> findByClaimId(Integer claimId);

    @Query("""
        select i
        from Invoice i
        where i.status in ('ISSUED', 'PARTIALLY_PAID')
          and i.dueAt < :now
          and i.totalPaid < i.totalAmount
    """)
    List<Invoice> findOverdueCandidates(LocalDateTime now);

    List<Invoice> findByStatusOrderByDueAtAsc(InvoiceStatus status);
}
