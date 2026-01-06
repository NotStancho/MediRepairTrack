package ua.nure.medirepairtrack.Event.Part;

import ua.nure.medirepairtrack.Entity.Part.UnitType;

import java.math.BigDecimal;

public record PartUsageUpdatedEvent(
        Integer claimId,
        Integer employeeId,

        Integer partId,
        String partCode,
        String partName,

        String unitName,
        UnitType unitType,

        BigDecimal oldQuantity,
        BigDecimal newQuantity,
        BigDecimal delta,

        BigDecimal unitPrice
) {
}