// hooks/useClaimHistory.ts

import { useCallback, useEffect, useState } from 'react';

import { getClaimHistory } from '../api/claimHistory';
import type { ClaimHistory } from '../types/claim/claimHistory';

export function useClaimHistory(claimId: number) {
    const [data, setData] = useState<ClaimHistory[]>([]);
    const [loading, setLoading] = useState(true);

    const load = useCallback(async (cancelled?: () => boolean) => {
        if (!claimId) {
            setData([]);
            setLoading(false);
            return;
        }

        setLoading(true);

        try {
            const response = await getClaimHistory(claimId);

            if (!cancelled?.()) {
                setData(response);
            }
        } finally {
            if (!cancelled?.()) {
                setLoading(false);
            }
        }
    }, [claimId]);

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
        refresh: load,
    };
}
