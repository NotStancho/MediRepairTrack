package ua.nure.medirepairtrack.Listener.Invoice;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import ua.nure.medirepairtrack.Event.Part.PartUsageUpdatedEvent;
import ua.nure.medirepairtrack.Event.Part.PartUsedAddedEvent;
import ua.nure.medirepairtrack.Event.Part.*;
import ua.nure.medirepairtrack.Service.InvoiceService;

@Slf4j
@Component
@RequiredArgsConstructor
public class InvoicePartsRecalcListener {

    private final InvoiceService invoiceService;

    @EventListener
    public void onPartUsedAdded(PartUsedAddedEvent event) {

        log.info(
                "[EVENT] InvoicePartsRecalc | reason=PART_USED_ADDED | claimId={} | part={} ({}) | qty={}",
                event.claimId(),
                event.partName(),
                event.partCode(),
                event.quantity()
        );

        invoiceService.recalculateParts(event.claimId());
    }

    @EventListener
    public void onPartUsageUpdated(PartUsageUpdatedEvent event) {

        log.info(
                "[EVENT] InvoicePartsRecalc | reason=PART_USAGE_UPDATED | claimId={} | part={} ({}) | {} → {}",
                event.claimId(),
                event.partName(),
                event.partCode(),
                event.oldQuantity(),
                event.newQuantity()
        );

        invoiceService.recalculateParts(event.claimId());
    }
}


