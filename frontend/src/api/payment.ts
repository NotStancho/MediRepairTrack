// api/payment.ts

import { api } from './api';
import type { Payment, PaymentMethod, PaymentView } from '../types/payment';

export const getAllPayments = async (): Promise<PaymentView[]> =>
    (await api.get<PaymentView[]>('/api/payment')).data;

export const getPaymentsByClient = async (
    clientId: number
): Promise<PaymentView[]> =>
    (await api.get<PaymentView[]>(`/api/payment/client/${clientId}`)).data;

export const getPaymentById = async (
    paymentId: number
): Promise<PaymentView> =>
    (await api.get<PaymentView>(`/api/payment/${paymentId}`)).data;

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
