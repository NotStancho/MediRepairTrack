export type PaymentStatus =
    | 'PENDING'
    | 'COMPLETED'
    | 'FAILED'
    | 'CANCELED'
    | 'REFUNDED'
    | 'CHARGEBACK';

export type PaymentMethod =
    | 'CASH'
    | 'CARD'
    | 'BANK_TRANSFER'
    | 'INVOICE_TRANSFER'
    | 'OTHER';

export interface Payment {
    id: number;
    invoiceId: number;
    amount: number;
    method: PaymentMethod;
    status: PaymentStatus;
    provider?: string;
    externalRef?: string;
    paidAt?: string;
    createdAt: string;
}
