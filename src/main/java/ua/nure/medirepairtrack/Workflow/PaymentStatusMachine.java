package ua.nure.medirepairtrack.Workflow;

import org.springframework.stereotype.Component;
import ua.nure.medirepairtrack.Entity.Payment.PaymentStatus;

import java.util.Map;
import java.util.Set;

@Component
public class PaymentStatusMachine {

    private static final Map<PaymentStatus, Set<PaymentStatus>> TRANSITIONS = Map.of(
            PaymentStatus.PENDING, Set.of(
                    PaymentStatus.COMPLETED,
                    PaymentStatus.FAILED,
                    PaymentStatus.CANCELED
            ),
            PaymentStatus.COMPLETED, Set.of(
                    PaymentStatus.REFUNDED,
                    PaymentStatus.CHARGEBACK
            ),
            PaymentStatus.FAILED, Set.of(),
            PaymentStatus.CANCELED, Set.of(),
            PaymentStatus.REFUNDED, Set.of(),
            PaymentStatus.CHARGEBACK, Set.of()
    );

    public boolean canTransition(PaymentStatus from, PaymentStatus to) {
        return TRANSITIONS.getOrDefault(from, Set.of()).contains(to);
    }

    public boolean isFinal(PaymentStatus status) {
        return TRANSITIONS.getOrDefault(status, Set.of()).isEmpty();
    }
}
