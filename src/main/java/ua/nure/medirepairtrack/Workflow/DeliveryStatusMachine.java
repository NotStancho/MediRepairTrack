package ua.nure.medirepairtrack.Workflow;

import org.springframework.stereotype.Component;
import ua.nure.medirepairtrack.Entity.Delivery.DeliveryStatus;

import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class DeliveryStatusMachine {

    private static final Map<DeliveryStatus, Set<DeliveryStatus>> TRANSITIONS = Map.of(
            DeliveryStatus.CREATED,
            Set.of(DeliveryStatus.IN_TRANSIT, DeliveryStatus.CANCELED),

            DeliveryStatus.IN_TRANSIT,
            Set.of(DeliveryStatus.DELIVERED, DeliveryStatus.FAILED, DeliveryStatus.CANCELED),

            DeliveryStatus.DELIVERED, Set.of(),
            DeliveryStatus.FAILED, Set.of(),
            DeliveryStatus.CANCELED, Set.of()
    );

    public boolean canTransition(DeliveryStatus from, DeliveryStatus to) {
        return TRANSITIONS.getOrDefault(from, Set.of()).contains(to);
    }

    public Set<DeliveryStatus> getAllowedNextStatuses(DeliveryStatus from) {
        return TRANSITIONS.getOrDefault(from, Set.of());
    }

    public boolean isFinal(DeliveryStatus status) {
        return getAllowedNextStatuses(status).isEmpty();
    }


    public boolean allowsUpdate(DeliveryStatus status) {
        return !isFinal(status);
    }
    public Set<DeliveryStatus> allowedUpdateStatuses() {
        return TRANSITIONS.entrySet().stream()
                .filter(e -> !e.getValue().isEmpty())
                .map(Map.Entry::getKey)
                .collect(Collectors.toSet());
    }


    public boolean allowsDelete(DeliveryStatus status) {
        return status == DeliveryStatus.CREATED;
    }
    public Set<DeliveryStatus> allowedDeleteStatuses() {
        return Set.of(DeliveryStatus.CREATED);
    }


    public boolean isBillable(DeliveryStatus status) {
        return status == DeliveryStatus.DELIVERED;
    }
    public Set<DeliveryStatus> billableStatuses() {
        return Set.of(DeliveryStatus.DELIVERED);
    }

}
