package ua.nure.medirepairtrack.Event.Invoice;

public record InvoiceCreatedEvent(
        Integer invoiceId,
        Integer claimId
) {}
