// hooks/useDeliveries.ts

import { useCallback, useEffect, useState } from 'react';

import type { DeliveryView } from '../types/delivery';

import {
    getAllDeliveries,
    getDeliveriesByClient,
    getDeliveryById,
} from '../api/delivery';

interface UseDeliveriesOptions {
    scope?: 'all' | 'client';
    clientId?: number | null;
}

export function useDeliveries(options: UseDeliveriesOptions = {}) {
    const {
        scope = 'all',
        clientId = null,
    } = options;

    const [data, setData] = useState<DeliveryView[]>([]);
    const [loading, setLoading] = useState(true);

    const [selected, setSelected] = useState<DeliveryView | null>(null);
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
                ? await getDeliveriesByClient(clientId!)
                : await getAllDeliveries();

            if (!cancelled?.()) {
                setData(response);
            }
        } finally {
            if (!cancelled?.()) {
                setLoading(false);
            }
        }
    }, [clientId, scope]);

    const loadOne = useCallback(async (deliveryId: number | null) => {
        if (!deliveryId) {
            setSelected(null);
            return null;
        }

        setSelectedLoading(true);
        try {
            const response = await getDeliveryById(deliveryId);
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
