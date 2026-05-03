// hooks/useClaimWorkParts

import { useCallback, useEffect, useState } from 'react';

import type { ClaimWorkPart } from '../types/claim/claimWorkPart';
import type {
    CreateClaimWorkPartPayload,
    UpdateClaimWorkPartQuantityPayload,
} from '../types/claim/claimWorkPartPayloads';

import {
    addClaimWorkPart,
    deleteClaimWorkPart,
    getClaimPartsByClaim,
    getClaimWorkParts,
    updateClaimWorkPartQuantity,
} from '../api/claimWorkPart';

function sortClaimWorkParts(items: ClaimWorkPart[]) {
    return [...items].sort((left, right) =>
        left.partName.localeCompare(right.partName, 'uk'),
    );
}

export function useClaimPartsByClaim(claimId: number) {
    const [data, setData] = useState<ClaimWorkPart[]>([]);
    const [loading, setLoading] = useState(true);

    const load = useCallback(async (cancelled?: () => boolean) => {
        setLoading(true);

        try {
            const response = await getClaimPartsByClaim(claimId);

            if (!cancelled?.()) {
                setData(sortClaimWorkParts(response));
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

    return {
        data,
        loading,
        refresh: load,
    };
}

export function useClaimWorkParts(claimWorkId: number | null) {
    const [data, setData] = useState<ClaimWorkPart[]>([]);
    const [loading, setLoading] = useState(false);

    const [creating, setCreating] = useState(false);
    const [updatingPartId, setUpdatingPartId] = useState<number | null>(null);
    const [deletingPartId, setDeletingPartId] = useState<number | null>(null);

    const load = useCallback(async (cancelled?: () => boolean) => {
        if (!claimWorkId) {
            setData([]);
            setLoading(false);
            return;
        }

        setLoading(true);

        try {
            const response = await getClaimWorkParts(claimWorkId);

            if (!cancelled?.()) {
                setData(sortClaimWorkParts(response));
            }
        } finally {
            if (!cancelled?.()) {
                setLoading(false);
            }
        }
    }, [claimWorkId]);

    useEffect(() => {
        let cancelled = false;

        void load(() => cancelled);

        return () => {
            cancelled = true;
        };
    }, [load]);

    const create = async (
        payload: CreateClaimWorkPartPayload,
        employeeId: number,
    ) => {
        if (!claimWorkId) {
            return null;
        }

        setCreating(true);

        try {
            const created = await addClaimWorkPart(claimWorkId, employeeId, payload);

            setData(prev => {
                const withoutDuplicate = prev.filter(
                    item => item.partId !== created.partId,
                );

                return sortClaimWorkParts([created, ...withoutDuplicate]);
            });

            return created;
        } finally {
            setCreating(false);
        }
    };

    const updateQuantity = async (
        payload: UpdateClaimWorkPartQuantityPayload,
        employeeId: number,
    ) => {
        if (!claimWorkId) {
            return null;
        }

        setUpdatingPartId(payload.partId);

        try {
            const updated = await updateClaimWorkPartQuantity(
                claimWorkId,
                employeeId,
                payload,
            );

            setData(prev => sortClaimWorkParts(
                prev.map(item => item.partId === updated.partId ? updated : item),
            ));

            return updated;
        } finally {
            setUpdatingPartId(null);
        }
    };

    const remove = async (partId: number, employeeId: number) => {
        if (!claimWorkId) {
            return;
        }

        setDeletingPartId(partId);

        try {
            await deleteClaimWorkPart(claimWorkId, partId, employeeId);
            setData(prev => prev.filter(item => item.partId !== partId));
        } finally {
            setDeletingPartId(null);
        }
    };

    return {
        data,
        loading,
        creating,
        updatingPartId,
        deletingPartId,
        create,
        updateQuantity,
        remove,
        refresh: load,
    };
}
