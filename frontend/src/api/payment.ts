import { api } from './api';
import type { Payment, PaymentMethod } from '../types/payment';

// отримати всі оплати по рахунку
export const getPaymentsByInvoice = async (
    invoiceId: number
): Promise<Payment[]> =>
    (await api.get<Payment[]>(`/api/payment/invoice/${invoiceId}`)).data;

// створити оплату (PENDING)
export const createPayment = async (payload: {
    invoiceId: number;
    amount: number;
    method: PaymentMethod;
    provider?: string;
    externalRef?: string;
}): Promise<Payment> =>
    (await api.post<Payment>('/api/payment', payload)).data;

// завершити оплату (COMPLETED)
export const completePayment = async (
    paymentId: number
): Promise<Payment> =>
    (await api.post<Payment>(`/api/payment/${paymentId}/complete`)).data;
