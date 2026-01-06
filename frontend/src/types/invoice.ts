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
    invoiceNumber: string;
    totalBeforeDiscount: number | null;
    discountAmount: number | null;
    totalAmount: number;
    totalPaid: number;
    status: InvoiceStatus;
    createdAt: string;
    issuedAt?: string;
    closedAt?: string;
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
    dueAt?: string;
    items: InvoiceDetail[];
}
