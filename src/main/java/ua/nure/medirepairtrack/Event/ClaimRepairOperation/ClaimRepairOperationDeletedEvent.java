package ua.nure.medirepairtrack.Event.ClaimRepairOperation;

import java.math.BigDecimal;

public record ClaimRepairOperationDeletedEvent(
        Integer claimId,
        Integer claimRepairOperationId,
        Integer employeeId,
        String employeeDisplayName,
        Integer repairWorkId,
        String repairWorkName,
        BigDecimal timeSpent
) {
}
