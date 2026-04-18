package ua.nure.medirepairtrack.Listener.Part;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import ua.nure.medirepairtrack.Entity.claim.ClaimHistory.ActionType;
import ua.nure.medirepairtrack.Event.Part.PartUsedAddedEvent;
import ua.nure.medirepairtrack.Service.claim.ClaimHistoryService;

@Slf4j
@Component
@RequiredArgsConstructor
public class PartUsedAddedHistoryListener {

    private final ClaimHistoryService claimHistoryService;

    @EventListener
    public void onPartUsed(PartUsedAddedEvent event) {

        log.info(
                "[EVENT] PartUsed | claimId={} | part={} ({}) | qty={} {} | price={}",
                event.claimId(),
                event.partName(),
                event.partCode(),
                event.quantity(),
                event.unitName(),
                event.unitPrice()
        );

        String description = String.format(
                "Використано запчастину: %s (%s). Кількість: %s %s. Ціна за одиницю: %s",
                event.partName(),
                event.partCode(),
                event.quantity(),
                event.unitName(),
                event.unitPrice()
        );

        claimHistoryService.addSystemEvent(
                event.claimId(),
                event.employeeId(),
                ActionType.PART_USED,
                description
        );
    }
}
