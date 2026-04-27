package ua.nure.medirepairtrack.Event.ClaimRepairOperation;

import java.math.BigDecimal;

public record ClaimRepairOperationCreatedEvent(
        Integer claimId,
        Integer claimRepairOperationId,
        Integer employeeId,
        String employeeDisplayName,
        Integer repairOperationId,
        String repairOperationName,
        BigDecimal timeSpent
) {
}
