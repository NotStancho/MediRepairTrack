import type { PaymentMethod, PaymentStatus } from '../types/payment';

/* ======================
   PAYMENT METHOD LABELS
   ====================== */

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
    CASH: 'Готівка',
    CARD: 'Банківська картка',
    BANK_TRANSFER: 'Банківський переказ',
    INVOICE_TRANSFER: 'Переказ за рахунком',
    OTHER: 'Інше',
};

/* ======================
   PAYMENT STATUS LABELS
   ====================== */

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
    PENDING: 'Очікує оплати',
    COMPLETED: 'Оплачено',
    FAILED: 'Помилка',
    CANCELED: 'Скасовано',
    REFUNDED: 'Повернено',
    CHARGEBACK: 'Chargeback',
};

/* ======================
   PAYMENT STATUS COLORS
   ====================== */

export const PAYMENT_STATUS_COLORS: Record<PaymentStatus, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    COMPLETED: 'bg-green-100 text-green-800',
    FAILED: 'bg-red-100 text-red-800',
    CANCELED: 'bg-gray-200 text-gray-700',
    REFUNDED: 'bg-blue-100 text-blue-800',
    CHARGEBACK: 'bg-purple-100 text-purple-800',
};
