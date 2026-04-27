package ua.nure.medirepairtrack.Event.ClaimRepairOperation;

import java.math.BigDecimal;

public record ClaimRepairOperationUpdatedEvent(
        Integer claimId,
        Integer claimRepairOperationId,
        Integer employeeId,
        String employeeDisplayName,
        Integer oldRepairOperationId,
        String oldRepairOperationName,
        Integer newRepairOperationId,
        String newRepairOperationName,
        BigDecimal oldTimeSpent,
        BigDecimal newTimeSpent
) {
}
