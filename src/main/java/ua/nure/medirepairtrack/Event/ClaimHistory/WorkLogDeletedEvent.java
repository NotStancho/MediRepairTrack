package ua.nure.medirepairtrack.Event.ClaimHistory;

import java.math.BigDecimal;

public record WorkLogDeletedEvent(
        Integer claimId,
        Integer employeeId,
        Integer workLogId,
        BigDecimal hours
) {}
