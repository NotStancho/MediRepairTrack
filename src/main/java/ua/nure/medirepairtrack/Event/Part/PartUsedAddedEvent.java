package ua.nure.medirepairtrack.Event.Part;

import ua.nure.medirepairtrack.Entity.repair.Part.UnitType;

import java.math.BigDecimal;

public record PartUsedAddedEvent(
        Integer claimId,
        Integer employeeId,

        Integer partId,
        String partCode,
        String partName,

        String unitName,
        UnitType unitType,

        BigDecimal quantity,
        BigDecimal unitPrice
) {
}
