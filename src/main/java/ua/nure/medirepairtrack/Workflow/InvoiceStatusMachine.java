package ua.nure.medirepairtrack.Workflow;

import org.springframework.stereotype.Component;
import ua.nure.medirepairtrack.Entity.billing.Invoice.InvoiceStatus;

import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class InvoiceStatusMachine {

    private static final Map<InvoiceStatus, Set<InvoiceStatus>> TRANSITIONS = Map.of(
            InvoiceStatus.DRAFT, Set.of(
                    InvoiceStatus.ISSUED,
                    InvoiceStatus.CANCELED
            ),

            InvoiceStatus.ISSUED, Set.of(
                    InvoiceStatus.PARTIALLY_PAID,
                    InvoiceStatus.PAID,
                    InvoiceStatus.OVERDUE,
                    InvoiceStatus.CANCELED
            ),

            InvoiceStatus.PARTIALLY_PAID, Set.of(
                    InvoiceStatus.PAID,
                    InvoiceStatus.OVERDUE,
                    InvoiceStatus.CANCELED
            ),

            InvoiceStatus.OVERDUE, Set.of(
                    InvoiceStatus.PARTIALLY_PAID,
                    InvoiceStatus.PAID,
                    InvoiceStatus.CANCELED
            ),

            InvoiceStatus.PAID, Set.of(),
            InvoiceStatus.CANCELED, Set.of()
    );


    // =========================
    // BASE
    // =========================
    public boolean canTransition(InvoiceStatus from, InvoiceStatus to) {
        return TRANSITIONS.getOrDefault(from, Set.of()).contains(to);
    }

    public boolean isFinal(InvoiceStatus status) {
        return TRANSITIONS.getOrDefault(status, Set.of()).isEmpty();
    }

    public Set<InvoiceStatus> getAllowedNextStatuses(InvoiceStatus status) {
        return TRANSITIONS.getOrDefault(status, Set.of());
    }

    // =========================
    // COST / BILLING
    // =========================

    /** Чи можна змінювати фінансові дані */
    public boolean allowsCostMutation(InvoiceStatus status) {
        return status == InvoiceStatus.DRAFT;
    }

    public Set<InvoiceStatus> allowedCostMutationStatuses() {
        return Set.of(InvoiceStatus.DRAFT);
    }

    /** Чи можна перераховувати billing */
    public boolean allowsRecalculate(InvoiceStatus status) {
        return status == InvoiceStatus.DRAFT;
    }

    public Set<InvoiceStatus> allowedRecalculateStatuses() {
        return Set.of(InvoiceStatus.DRAFT);
    }


    // =========================
    // PAYMENT
    // =========================
    public boolean allowsPayment(InvoiceStatus status) {
        return status == InvoiceStatus.ISSUED
                || status == InvoiceStatus.PARTIALLY_PAID
                || status == InvoiceStatus.OVERDUE;
    }
    public Set<InvoiceStatus> allowedPaymentStatuses() {
        return Set.of(
                InvoiceStatus.ISSUED,
                InvoiceStatus.PARTIALLY_PAID,
                InvoiceStatus.OVERDUE
        );
    }


    public boolean allowsDueDateUpdate(InvoiceStatus status) {
        return !isFinal(status);
    }

    public Set<InvoiceStatus> allowedDueDateUpdateStatuses() {
        return TRANSITIONS.entrySet().stream()
                .filter(e -> !e.getValue().isEmpty())
                .map(Map.Entry::getKey)
                .collect(Collectors.toSet());
    }

}
