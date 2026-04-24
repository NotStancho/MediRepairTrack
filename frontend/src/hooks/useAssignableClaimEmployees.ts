// hooks/useAssignableClaimEmployees

import { useCallback, useEffect, useState } from 'react';

import { getAssignableClaimEmployees } from '../api/claimEmployee';

import type { EmployeeShort } from '../types/employee/employee';

function sortEmployees(items: EmployeeShort[]) {
    return [...items].sort((left, right) => {
        const leftKey = `${left.lastName} ${left.firstName}`.trim().toLowerCase();
        const rightKey = `${right.lastName} ${right.firstName}`.trim().toLowerCase();

        return leftKey.localeCompare(rightKey);
    });
}

export function useAssignableClaimEmployees(
    claimId: number,
    performedByEmployeeId: number | null,
    enabled = true,
) {
    const [data, setData] = useState<EmployeeShort[]>([]);
    const [loading, setLoading] = useState(false);

    const load = useCallback(async (cancelled?: () => boolean) => {
        if (!enabled || !claimId || performedByEmployeeId == null) {
            if (!cancelled?.()) {
                setData([]);
                setLoading(false);
            }
            return;
        }

        setLoading(true);

        try {
            const response = await getAssignableClaimEmployees(claimId, performedByEmployeeId);

            if (!cancelled?.()) {
                setData(sortEmployees(response));
            }
        } finally {
            if (!cancelled?.()) {
                setLoading(false);
            }
        }
    }, [performedByEmployeeId, claimId, enabled]);

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
