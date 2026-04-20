import type { InvoiceStatus } from './invoice';

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
    provider?: string | null;
    externalRef?: string | null;
    paidAt?: string | null;
    createdAt: string;
}

export interface PaymentView extends Payment {
    claimId: number;
    clientId: number;
    clientOrganizationName: string;
    invoiceNumber: string;
    invoiceStatus: InvoiceStatus;
    invoiceTotalAmount: number;
}
