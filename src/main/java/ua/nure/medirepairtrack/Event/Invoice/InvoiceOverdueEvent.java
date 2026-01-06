package ua.nure.medirepairtrack.Event.Invoice;

public record InvoiceOverdueEvent(
        Integer invoiceId,
        Integer claimId
) {}
