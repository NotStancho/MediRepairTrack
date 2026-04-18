package ua.nure.medirepairtrack.Listener.claim.Claim;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import ua.nure.medirepairtrack.Const.SystemEmployee;
import ua.nure.medirepairtrack.Entity.claim.ClaimHistory.ActionType;
import ua.nure.medirepairtrack.Event.Claim.ClaimCreatedEvent;
import ua.nure.medirepairtrack.Service.claim.ClaimHistoryService;

@Slf4j
@Component
@RequiredArgsConstructor
public class ClaimCreationHistoryListener {

    private final ClaimHistoryService claimHistoryService;

    @EventListener
    public void onClaimCreated(ClaimCreatedEvent event) {

        log.info(
                "[EVENT] ClaimCreated | claimId={} | creatorEmployeeId={} | status={} | repairType={}",
                event.claimId(),
                event.creatorEmployeeId(),
                event.status(),
                event.repairType()
        );

        String description =
                event.creatorEmployeeId() == null
                        ? String.format(
                        "Заявка створена клієнтом. Тип ремонту: %s. Статус: %s",
                        event.repairType(),
                        event.status()
                )
                        : String.format(
                        "Заявка створена працівником для клієнта. Тип ремонту: %s. Статус: %s",
                        event.repairType(),
                        event.status()
                );

        Integer actorEmployeeId =
                event.creatorEmployeeId() != null
                        ? event.creatorEmployeeId()
                        : SystemEmployee.ID;

        claimHistoryService.addSystemEvent(
                event.claimId(),
                actorEmployeeId,
                ActionType.SYSTEM_EVENT,
                description
        );
    }
}
