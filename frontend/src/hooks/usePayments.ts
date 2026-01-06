import { useEffect, useState } from 'react';
import type { Payment, PaymentMethod } from '../types/payment';
import { getPaymentsByInvoice, createPayment, completePayment } from '../api/payment';

export function usePayments(invoiceId?: number) {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(false);

    const loadPayments = async () => {
        if (!invoiceId) return;
        setLoading(true);
        try {
            const data = await getPaymentsByInvoice(invoiceId);
            setPayments(data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPayments();
    }, [invoiceId]);

    const addPayment = async (payload: {
        amount: number;
        method: PaymentMethod;
        provider?: string;
        externalRef?: string;
    }) => {
        if (!invoiceId) return;

        const payment = await createPayment({
            invoiceId,
            ...payload,
        });

        // для курсової — авто complete
        await completePayment(payment.id);

        await loadPayments();
    };

    return {
        payments,
        loading,
        reload: loadPayments,
        addPayment,
    };
}
