// hooks/diagnosis/dss/useSimilarityResults.ts

import { useCallback, useEffect, useState } from 'react';

import type { SimilarityResult } from '../../types/diagnosis/DSS/similarityResult';
import type {
    CreateSimilarityResultPayload,
    UpdateSimilarityResultPayload
} from '../../types/diagnosis/DSS/similarityResultPayloads';

import type { ClaimShort } from '../../types/claim/claimShort';

import {
    createSimilarityResult,
    createSimilarityResultsBatch,
    getSimilarityResults,
    getAvailableSimilarClaims,
    updateSimilarityResult,
    deleteSimilarityResult
} from '../../api/diagnosis/dss/similarityResult';

export function useSimilarityResults(predictionId: number) {
    const [data, setData] = useState<SimilarityResult[]>([]);
    const [available, setAvailable] = useState<ClaimShort[]>([]);

    const [loading, setLoading] = useState(true);

    const [creating, setCreating] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [removing, setRemoving] = useState(false);

    // load selected
    const load = useCallback(async (cancelled?: () => boolean) => {
        if (!predictionId) {
            if (!cancelled?.()) {
                setData([]);
                setLoading(false);
            }
            return;
        }

        setLoading(true);
        try {
            const res = await getSimilarityResults(predictionId);
            if (!cancelled?.()) setData(res);
        } finally {
            if (!cancelled?.()) setLoading(false);
        }
    }, [predictionId]);

    // load available claims
    const loadAvailable = useCallback(async () => {
        if (!predictionId) return;

        const res = await getAvailableSimilarClaims(predictionId);
        setAvailable(res);
    }, [predictionId]);

    useEffect(() => {
        let cancelled = false;

        void load(() => cancelled);
        void loadAvailable();

        return () => {
            cancelled = true;
        };
    }, [load, loadAvailable]);

    const create = async (payload: CreateSimilarityResultPayload) => {
        setCreating(true);
        try {
            const created = await createSimilarityResult(payload);

            setData(prev => [...prev, created]);

            await loadAvailable(); // sync

            return created;
        } finally {
            setCreating(false);
        }
    };

    const createBatch = async (payload: CreateSimilarityResultPayload[]) => {
        setCreating(true);
        try {
            const created = await createSimilarityResultsBatch(payload);

            setData(prev => [...prev, ...created]);

            await loadAvailable(); // sync

            return created;
        } finally {
            setCreating(false);
        }
    };

    const update = async (
        claimId: number,
        payload: UpdateSimilarityResultPayload
    ) => {
        setUpdating(true);
        try {
            const updated = await updateSimilarityResult(
                predictionId,
                claimId,
                payload
            );

            setData(prev =>
                prev.map(s =>
                    s.claim.id === claimId ? updated : s
                )
            );

            return updated;
        } finally {
            setUpdating(false);
        }
    };

    const remove = async (claimId: number) => {
        setRemoving(true);
        try {
            await deleteSimilarityResult(predictionId, claimId);

            setData(prev =>
                prev.filter(s => s.claim.id !== claimId)
            );

            await loadAvailable(); // sync
        } finally {
            setRemoving(false);
        }
    };

    return {
        data,
        available,
        loading,

        creating,
        updating,
        removing,

        create,
        createBatch,
        update,
        remove,

        refresh: load,
        refreshAvailable: loadAvailable
    };
}