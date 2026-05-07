package ua.nure.medirepairtrack.Event.ClaimWorkPart;

import ua.nure.medirepairtrack.Entity.repair.Part.UnitType;

import java.math.BigDecimal;

public record ClaimWorkPartUpdatedEvent(
        Integer claimId,
        Integer claimWorkId,
        String repairWorkName,
        Integer employeeId,

        Integer partId,
        String partCode,
        String partName,

        String unitName,
        UnitType unitType,

        BigDecimal oldQuantity,
        BigDecimal newQuantity,
        BigDecimal delta
) {
}