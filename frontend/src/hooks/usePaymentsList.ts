// hooks/usePaymentsList.ts

import { useCallback, useEffect, useState } from 'react';

import type { PaymentView } from '../types/payment';

import {
    getAllPayments,
    getPaymentById,
    getPaymentsByClient,
} from '../api/payment';

interface UsePaymentsListOptions {
    scope?: 'all' | 'client';
    clientId?: number | null;
}

export function usePaymentsList(options: UsePaymentsListOptions = {}) {
    const {
        scope = 'all',
        clientId = null,
    } = options;

    const [data, setData] = useState<PaymentView[]>([]);
    const [loading, setLoading] = useState(true);

    const [selected, setSelected] = useState<PaymentView | null>(null);
    const [selectedLoading, setSelectedLoading] = useState(false);

    const load = useCallback(async (cancelled?: () => boolean) => {
        if (scope === 'client' && !clientId) {
            setData([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const response = scope === 'client'
                ? await getPaymentsByClient(clientId!)
                : await getAllPayments();

            if (!cancelled?.()) {
                setData(response);
            }
        } finally {
            if (!cancelled?.()) {
                setLoading(false);
            }
        }
    }, [clientId, scope]);

    const loadOne = useCallback(async (paymentId: number | null) => {
        if (!paymentId) {
            setSelected(null);
            return null;
        }

        setSelectedLoading(true);
        try {
            const response = await getPaymentById(paymentId);
            setSelected(response);
            return response;
        } finally {
            setSelectedLoading(false);
        }
    }, []);

    useEffect(() => {
        let cancelled = false;

        void load(() => cancelled);

        return () => {
            cancelled = true;
        };
    }, [load]);

    return {
        data,
        loading,
        selected,
        selectedLoading,
        loadOne,
        refresh: load,
    };
}
