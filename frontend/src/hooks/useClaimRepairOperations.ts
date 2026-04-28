// hooks/useClaimRepairOperations

import { useCallback, useEffect, useState } from 'react';

import type { ClaimRepairOperation } from '../types/claim/claimRepairOperation';
import type {
    CreateClaimRepairOperationPayload,
    UpdateClaimRepairOperationNotePayload,
    UpdateClaimRepairOperationPayload,
} from '../types/claim/claimRepairOperationPayloads';

import {
    createClaimRepairOperation,
    deleteClaimRepairOperation,
    getClaimRepairOperationsByClaim,
    updateClaimRepairOperation,
    updateClaimRepairOperationNote,
} from '../api/claimRepairOperation';

function sortClaimRepairOperations(items: ClaimRepairOperation[]) {
    return [...items].sort((left, right) =>
        new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
    );
}

export function useClaimRepairOperations(claimId: number) {
    const [data, setData] = useState<ClaimRepairOperation[]>([]);
    const [loading, setLoading] = useState(true);

    const [creating, setCreating] = useState(false);
    const [updatingId, setUpdatingId] = useState<number | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const load = useCallback(async (cancelled?: () => boolean) => {
        setLoading(true);

        try {
            const response = await getClaimRepairOperationsByClaim(claimId);

            if (!cancelled?.()) {
                setData(sortClaimRepairOperations(response));
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
        payload: CreateClaimRepairOperationPayload,
        performedByEmployeeId: number,
    ) => {
        setCreating(true);

        try {
            const created = await createClaimRepairOperation(payload, performedByEmployeeId);
            setData(prev => sortClaimRepairOperations([created, ...prev]));
            return created;
        } finally {
            setCreating(false);
        }
    };

    const update = async (
        id: number,
        payload: UpdateClaimRepairOperationPayload,
        performedByEmployeeId: number,
    ) => {
        setUpdatingId(id);

        try {
            const updated = await updateClaimRepairOperation(id, payload, performedByEmployeeId);

            setData(prev => sortClaimRepairOperations(
                prev.map(item => (item.id === id ? updated : item)),
            ));

            return updated;
        } finally {
            setUpdatingId(null);
        }
    };

    const updateNote = async (
        id: number,
        payload: UpdateClaimRepairOperationNotePayload,
        performedByEmployeeId: number,
    ) => {
        setUpdatingId(id);

        try {
            const updated = await updateClaimRepairOperationNote(id, payload, performedByEmployeeId);

            setData(prev => sortClaimRepairOperations(
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
            await deleteClaimRepairOperation(id, performedByEmployeeId);
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
