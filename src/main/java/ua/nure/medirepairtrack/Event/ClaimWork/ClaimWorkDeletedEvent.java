package ua.nure.medirepairtrack.Event.ClaimWork;

import java.math.BigDecimal;

public record ClaimWorkDeletedEvent(
        Integer claimId,
        Integer claimWorkId,
        Integer employeeId,
        String employeeDisplayName,
        Integer repairWorkId,
        String repairWorkName,
        BigDecimal timeSpent
) {
}
