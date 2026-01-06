package ua.nure.medirepairtrack.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ua.nure.medirepairtrack.Entity.Invoice.Invoice;
import ua.nure.medirepairtrack.Entity.Invoice.InvoiceStatus;
import ua.nure.medirepairtrack.Event.Invoice.InvoiceOverdueEvent;
import ua.nure.medirepairtrack.Repository.InvoiceRepository;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class InvoiceOverdueScheduler {

    private final InvoiceRepository invoiceRepository;
    private final ApplicationEventPublisher eventPublisher;

    /**
     * Перевірка прострочених рахунків
     * Запускається кожні 30 хв
     */
    @Transactional
    @Scheduled(fixedDelay = 30 * 60 * 1000)
    public void markOverdueInvoices() {

        LocalDateTime now = LocalDateTime.now();

        List<Invoice> overdueInvoices = invoiceRepository.findOverdueCandidates(now);

        for (Invoice invoice : overdueInvoices) {
            invoice.setStatus(InvoiceStatus.OVERDUE);
            invoice.setUpdatedAt(now);

            log.warn(
                    "[OVERDUE] Invoice {} for claim {} marked as OVERDUE",
                    invoice.getInvoiceNumber(),
                    invoice.getClaim().getId()
            );
        }

        invoiceRepository.saveAll(overdueInvoices);

        for (Invoice invoice : overdueInvoices) {
            eventPublisher.publishEvent(
                    new InvoiceOverdueEvent(
                            invoice.getId(),
                            invoice.getClaim().getId()
                    )
            );
        }
    }
}