package ua.nure.medirepairtrack.Event.ClaimWork;

import java.math.BigDecimal;

public record ClaimWorkCreatedEvent(
        Integer claimId,
        Integer claimWorkId,
        Integer employeeId,
        String employeeDisplayName,
        Integer repairWorkId,
        String repairWorkName,
        BigDecimal timeSpent
) {
}
