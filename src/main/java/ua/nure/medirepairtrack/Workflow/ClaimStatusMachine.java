package ua.nure.medirepairtrack.Workflow;

import org.springframework.stereotype.Component;
import ua.nure.medirepairtrack.Entity.claim.Claim.Status;

import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class ClaimStatusMachine {

    // COMPLETED — системний фінальний статус.
    // Перехід у COMPLETED здійснюється ТІЛЬКИ через ClaimService.tryCompleteClaim()
    // після отримання фінансової події (InvoicePaidEvent).
    private static final Map<Status, Set<Status>> TRANSITIONS = Map.of(
            Status.NEW, Set.of(Status.IN_REVIEW, Status.CANCELED),

            Status.IN_REVIEW, Set.of(
                    Status.ACCEPTED,
                    Status.REJECTED,
                    Status.CANCELED
            ),

            Status.ACCEPTED, Set.of(
                    Status.ASSIGNED_TO_ENGINEER,
                    Status.CANCELED
            ),

            Status.ASSIGNED_TO_ENGINEER, Set.of(
                    Status.IN_PROGRESS,
                    Status.CANCELED
            ),

            Status.IN_PROGRESS, Set.of(
                    Status.WAITING_FOR_PARTS,
                    Status.COMPLETED,
                    Status.CANCELED
            ),

            Status.WAITING_FOR_PARTS, Set.of(
                    Status.IN_PROGRESS,
                    Status.CANCELED
            ),

            Status.REJECTED, Set.of(),
            Status.COMPLETED, Set.of(),
            Status.CANCELED, Set.of()
    );

    public boolean canTransition(Status from, Status to) {
        return TRANSITIONS.getOrDefault(from, Set.of()).contains(to);
    }

    public Set<Status> getAllowedNextStatuses(Status from) {
        return TRANSITIONS.getOrDefault(from, Set.of());
    }

    public boolean isFinal(Status status) {
        return TRANSITIONS.getOrDefault(status, Set.of()).isEmpty();
    }

    public boolean allowsAssignment(Status status) {
        return !isFinal(status);
    }


    public boolean allowsInvoiceCreation(Status status) {
        return Set.of(
                Status.ACCEPTED,
                Status.ASSIGNED_TO_ENGINEER,
                Status.IN_PROGRESS,
                Status.WAITING_FOR_PARTS
        ).contains(status);
    }

    public Set<Status> allowedInvoiceCreationStatuses() {
        return Set.of(
                Status.ACCEPTED,
                Status.ASSIGNED_TO_ENGINEER,
                Status.IN_PROGRESS,
                Status.WAITING_FOR_PARTS
        );
    }


    public boolean allowsWorkLog(Status status) {
        return status == Status.IN_PROGRESS || status == Status.WAITING_FOR_PARTS;
    }
    public Set<Status> allowedWorkLogStatuses() {
        return Set.of(Status.IN_PROGRESS, Status.WAITING_FOR_PARTS);
    }



    public boolean allowsClaimEdit(Status status) {
        return !isFinal(status);
    }
    public Set<Status> allowedClaimEditStatuses() {
        return TRANSITIONS.entrySet().stream()
                .filter(e -> !e.getValue().isEmpty()) // не фінальні
                .map(Map.Entry::getKey)
                .collect(Collectors.toSet());
    }



    public boolean allowsPartUsage(Status status) {
        return status == Status.IN_PROGRESS || status == Status.WAITING_FOR_PARTS || status == Status.ASSIGNED_TO_ENGINEER;
    }
    public Set<Status> allowedPartUsageStatuses() {
        return Set.of(Status.IN_PROGRESS, Status.WAITING_FOR_PARTS, Status.ASSIGNED_TO_ENGINEER);
    }


    public boolean allowsDelivery(Status status) {
        return status == Status.ASSIGNED_TO_ENGINEER || status == Status.IN_PROGRESS || status == Status.WAITING_FOR_PARTS;
    }
    public Set<Status> allowedDeliveryStatuses() {
        return Set.of(
                Status.ASSIGNED_TO_ENGINEER,
                Status.IN_PROGRESS,
                Status.WAITING_FOR_PARTS
        );
    }

    public boolean allowsEmbeddingGeneration(Status status) {
        return status == Status.ACCEPTED
                || status == Status.ASSIGNED_TO_ENGINEER
                || status == Status.IN_PROGRESS
                || status == Status.WAITING_FOR_PARTS;
    }
}
