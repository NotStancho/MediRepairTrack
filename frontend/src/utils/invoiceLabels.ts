import type { InvoiceStatus } from '../types/invoice';

export const INVOICE_STATUS_LABELS = {
    DRAFT: 'Чернетка',
    ISSUED: 'Виставлений',
    PARTIALLY_PAID: 'Частково оплачений',
    PAID: 'Оплачений',
    OVERDUE: 'Прострочений',
    CANCELED: 'Скасований',
};

export const INVOICE_STATUS_COLORS: Record<InvoiceStatus, string> = {
    DRAFT: 'bg-gray-100 text-gray-700',
    ISSUED: 'bg-blue-100 text-blue-800',
    PARTIALLY_PAID: 'bg-yellow-100 text-yellow-800',
    PAID: 'bg-green-100 text-green-800',
    OVERDUE: 'bg-red-100 text-red-800',
    CANCELED: 'bg-gray-200 text-gray-500',
};

export const INVOICE_ITEM_LABELS = {
    LABOR: 'Роботи',
    PARTS: 'Запчастини',
    DELIVERY: 'Доставка',
    OTHER: 'Інше',
};
