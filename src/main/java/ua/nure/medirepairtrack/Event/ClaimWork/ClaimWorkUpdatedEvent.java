package ua.nure.medirepairtrack.Event.ClaimWork;

import java.math.BigDecimal;

public record ClaimWorkUpdatedEvent(
        Integer claimId,
        Integer claimWorkId,
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
