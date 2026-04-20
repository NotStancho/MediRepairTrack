// hooks/useInvoices.ts

import { useCallback, useEffect, useState } from 'react';

import type { Invoice, InvoiceFull } from '../types/invoice';

import {
    getAllInvoices,
    getInvoiceFullById,
    getInvoicesByClient,
} from '../api/invoice';

interface UseInvoicesOptions {
    scope?: 'all' | 'client';
    clientId?: number | null;
}

export function useInvoices(options: UseInvoicesOptions = {}) {
    const {
        scope = 'all',
        clientId = null,
    } = options;

    const [data, setData] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);

    const [selected, setSelected] = useState<InvoiceFull | null>(null);
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
                ? await getInvoicesByClient(clientId!)
                : await getAllInvoices();

            if (!cancelled?.()) {
                setData(response);
            }
        } finally {
            if (!cancelled?.()) {
                setLoading(false);
            }
        }
    }, [clientId, scope]);

    const loadOne = useCallback(async (invoiceId: number | null) => {
        if (!invoiceId) {
            setSelected(null);
            return null;
        }

        setSelectedLoading(true);
        try {
            const response = await getInvoiceFullById(invoiceId);
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
