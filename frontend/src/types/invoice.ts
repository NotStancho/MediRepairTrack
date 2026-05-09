export type InvoiceStatus =
    | 'DRAFT'
    | 'ISSUED'
    | 'PARTIALLY_PAID'
    | 'PAID'
    | 'CANCELED'
    | 'OVERDUE';

export interface Invoice {
    id: number;
    claimId: number;
    clientId: number;
    clientOrganizationName: string;
    invoiceNumber: string;
    totalBeforeDiscount: number | null;
    discountAmount: number | null;
    totalAmount: number;
    totalPaid: number;
    status: InvoiceStatus;
    createdAt: string;
    issuedAt?: string | null;
    dueAt?: string | null;
    closedAt?: string | null;
}

export interface InvoiceDetail {
    id: number;
    itemType: 'LABOR' | 'PARTS' | 'DELIVERY' | 'OTHER';
    description: string;
    quantity: number;
    unitName: string;
    pricePerUnit: number;
    totalPrice: number;
}

export interface InvoiceFull extends Invoice {
    items: InvoiceDetail[];
}

export interface InvoiceOtherItemPayload {
    description: string;
    quantity: number;
    unitName: string;
    pricePerUnit: number;
}
