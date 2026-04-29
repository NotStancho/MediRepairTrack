// hooks/useClaimWorks

import { useCallback, useEffect, useState } from 'react';

import type { ClaimWork } from '../types/claim/claimWork';
import type {
    CreateClaimWorkPayload,
    UpdateClaimWorkNotePayload,
    UpdateClaimWorkPayload,
} from '../types/claim/claimWorkPayloads';

import {
    createClaimWork,
    deleteClaimWork,
    getClaimWorksByClaim,
    updateClaimWork,
    updateClaimWorkNote,
} from '../api/claimWork';

function sortClaimWorks(items: ClaimWork[]) {
    return [...items].sort((left, right) =>
        new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
    );
}

export function useClaimWorks(claimId: number) {
    const [data, setData] = useState<ClaimWork[]>([]);
    const [loading, setLoading] = useState(true);

    const [creating, setCreating] = useState(false);
    const [updatingId, setUpdatingId] = useState<number | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const load = useCallback(async (cancelled?: () => boolean) => {
        setLoading(true);

        try {
            const response = await getClaimWorksByClaim(claimId);

            if (!cancelled?.()) {
                setData(sortClaimWorks(response));
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

    const create = async (
        payload: CreateClaimWorkPayload,
        performedByEmployeeId: number,
    ) => {
        setCreating(true);

        try {
            const created = await createClaimWork(payload, performedByEmployeeId);
            setData(prev => sortClaimWorks([created, ...prev]));
            return created;
        } finally {
            setCreating(false);
        }
    };

    const update = async (
        id: number,
        payload: UpdateClaimWorkPayload,
        performedByEmployeeId: number,
    ) => {
        setUpdatingId(id);

        try {
            const updated = await updateClaimWork(id, payload, performedByEmployeeId);

            setData(prev => sortClaimWorks(
                prev.map(item => (item.id === id ? updated : item)),
            ));

            return updated;
        } finally {
            setUpdatingId(null);
        }
    };

    const updateNote = async (
        id: number,
        payload: UpdateClaimWorkNotePayload,
        performedByEmployeeId: number,
    ) => {
        setUpdatingId(id);

        try {
            const updated = await updateClaimWorkNote(id, payload, performedByEmployeeId);

            setData(prev => sortClaimWorks(
                prev.map(item => (item.id === id ? updated : item)),
            ));

            return updated;
        } finally {
            setUpdatingId(null);
        }
    };

    const remove = async (id: number, performedByEmployeeId: number) => {
        setDeletingId(id);

        try {
            await deleteClaimWork(id, performedByEmployeeId);
            setData(prev => prev.filter(item => item.id !== id));
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
        updateNote,
        remove,
        refresh: load,
    };
}
