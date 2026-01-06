package ua.nure.medirepairtrack.Event.Invoice;

public record InvoicePaidEvent(
        Integer invoiceId,
        Integer claimId
) {}
