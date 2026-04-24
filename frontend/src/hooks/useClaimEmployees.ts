// hooks/useClaimEmployees

import { useCallback, useEffect, useState } from 'react';

import type { ClaimEmployee } from '../types/claimEmployee';
import type {
    AssignEmployeeToClaimPayload,
    UpdateClaimEmployeePayload,
} from '../types/claim/claimEmployeePayloads';

import {
    assignEmployeeToClaim,
    deleteClaimEmployee,
    getClaimEmployees,
    updateClaimEmployee,
} from '../api/claimEmployee';

function sortClaimEmployees(items: ClaimEmployee[]) {
    return [...items].sort((left, right) => {
        const leftKey = `${left.lastName} ${left.firstName}`.trim().toLowerCase();
        const rightKey = `${right.lastName} ${right.firstName}`.trim().toLowerCase();

        return leftKey.localeCompare(rightKey);
    });
}

export function useClaimEmployees(claimId: number) {
    const [data, setData] = useState<ClaimEmployee[]>([]);
    const [loading, setLoading] = useState(true);

    const [creating, setCreating] = useState(false);
    const [updatingId, setUpdatingId] = useState<number | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const load = useCallback(async (cancelled?: () => boolean) => {
        setLoading(true);

        try {
            const response = await getClaimEmployees(claimId);

            if (!cancelled?.()) {
                setData(sortClaimEmployees(response));
            }
        } finally {
            if (!cancelled?.()) {
                setLoading(false);
            }
        }
    }, [claimId]);

    useEffect(() => {
        let cancelled = false;

        if (!claimId) {
            setData([]);
            setLoading(false);
            return;
        }

        void load(() => cancelled);

        return () => {
            cancelled = true;
        };
    }, [claimId, load]);

    const create = async (payload: AssignEmployeeToClaimPayload) => {
        setCreating(true);

        try {
            const created = await assignEmployeeToClaim(claimId, payload);
            setData(prev => sortClaimEmployees([...prev, created]));
            return created;
        } finally {
            setCreating(false);
        }
    };

    const update = async (
        employeeId: number,
        payload: UpdateClaimEmployeePayload,
    ) => {
        setUpdatingId(employeeId);

        try {
            const updated = await updateClaimEmployee(claimId, employeeId, payload);

            setData(prev => sortClaimEmployees(
                prev.map(item => (item.employeeId === employeeId ? updated : item)),
            ));

            return updated;
        } finally {
            setUpdatingId(null);
        }
    };

    const remove = async (
        employeeId: number,
        performedByEmployeeId: number,
    ) => {
        setDeletingId(employeeId);

        try {
            await deleteClaimEmployee(claimId, employeeId, performedByEmployeeId);
            setData(prev => prev.filter(item => item.employeeId !== employeeId));
        } finally {
            setDeletingId(null);
        }
    };

    return {
        data,
        loading,
        creating,
        updatingId,
        deletingId,
        create,
        update,
        remove,
        refresh: load,
    };
}
