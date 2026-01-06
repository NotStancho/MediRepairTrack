package ua.nure.medirepairtrack.Event.ClaimHistory;

import java.math.BigDecimal;

public record WorkLogUpdatedEvent(
        Integer claimId,
        Integer employeeId,
        Integer workLogId,
        BigDecimal oldHours,
        BigDecimal newHours
) {}
