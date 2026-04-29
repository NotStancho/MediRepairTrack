package ua.nure.medirepairtrack.Event.ClaimRepairOperation;

import java.math.BigDecimal;

public record ClaimRepairOperationUpdatedEvent(
        Integer claimId,
        Integer claimRepairOperationId,
        Integer employeeId,
        String employeeDisplayName,
        Integer oldRepairWorkId,
        String oldRepairWorkName,
        Integer newRepairWorkId,
        String newRepairWorkName,
        BigDecimal oldTimeSpent,
        BigDecimal newTimeSpent
) {
}
