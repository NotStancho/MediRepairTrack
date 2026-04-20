// hooks/usePricingConfigs.ts

import { useCallback, useEffect, useMemo, useState } from 'react';

import type { RepairType } from '../types/claim/claim';
import type {
    PricingConfig,
    UpdatePricingConfigPayload,
} from '../types/pricingConfig';

import {
    getAllPricingConfigs,
    updatePricingConfig,
} from '../api/pricingConfig';
import { REPAIR_TYPE_LABELS } from '../utils/claimLabels';

export function usePricingConfigs() {
    const [data, setData] = useState<PricingConfig[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingRepairType, setUpdatingRepairType] = useState<RepairType | null>(null);

    const load = useCallback(async (cancelled?: () => boolean) => {
        setLoading(true);
        try {
            const response = await getAllPricingConfigs();

            if (!cancelled?.()) {
                setData(response);
            }
        } finally {
            if (!cancelled?.()) {
                setLoading(false);
            }
        }
    }, []);

    useEffect(() => {
        let cancelled = false;

        void load(() => cancelled);

        return () => {
            cancelled = true;
        };
    }, [load]);

    const update = async (
        repairType: RepairType,
        payload: UpdatePricingConfigPayload
    ) => {
        setUpdatingRepairType(repairType);
        try {
            const updated = await updatePricingConfig(repairType, payload);

            setData(prev =>
                prev.map(item => item.repairType === repairType ? updated : item)
            );

            return updated;
        } finally {
            setUpdatingRepairType(null);
        }
    };

    const sortedData = useMemo(
        () => [...data].sort((a, b) =>
            REPAIR_TYPE_LABELS[a.repairType].localeCompare(REPAIR_TYPE_LABELS[b.repairType], 'uk-UA')
        ),
        [data]
    );

    return {
        data: sortedData,
        loading,
        updatingRepairType,
        update,
        refresh: load,
    };
}
