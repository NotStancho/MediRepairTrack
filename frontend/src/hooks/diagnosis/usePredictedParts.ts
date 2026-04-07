// hooks/diagnosis/dss/usePredictedParts.ts

import { useCallback, useEffect, useState } from 'react';
import type { PredictedPart } from '../../types/diagnosis/DSS/predictedPart';
import type {
    CreatePredictedPartPayload,
    UpdatePredictedPartPayload
} from '../../types/diagnosis/DSS/predictedPartPayloads';
import type { PartShort } from '../../types/part/partShort';

import {
    createPredictedPart,
    createPredictedPartsBatch,
    getPredictedParts,
    getAvailableParts,
    updatePredictedPart,
    deletePredictedPart
} from '../../api/diagnosis/dss/predictedPart';

export function usePredictedParts(predictionId: number) {
    const [data, setData] = useState<PredictedPart[]>([]);
    const [available, setAvailable] = useState<PartShort[]>([]);

    const [loading, setLoading] = useState(true);

    const [creating, setCreating] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [removing, setRemoving] = useState(false);

    // load parts
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
            const res = await getPredictedParts(predictionId);
            if (!cancelled?.()) setData(res);
        } finally {
            if (!cancelled?.()) setLoading(false);
        }
    }, [predictionId]);

    // load available parts
    const loadAvailable = useCallback(async () => {
        if (!predictionId) return;

        const res = await getAvailableParts(predictionId);
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

    const create = async (payload: CreatePredictedPartPayload) => {
        setCreating(true);
        try {
            const created = await createPredictedPart(payload);
            setData(prev => [...prev, created]);

            await loadAvailable(); // sync

            return created;
        } finally {
            setCreating(false);
        }
    };

    const createBatch = async (payload: CreatePredictedPartPayload[]) => {
        setCreating(true);
        try {
            const created = await createPredictedPartsBatch(payload);
            setData(prev => [...prev, ...created]);

            await loadAvailable(); // sync

            return created;
        } finally {
            setCreating(false);
        }
    };

    const update = async (
        partId: number,
        payload: UpdatePredictedPartPayload
    ) => {
        setUpdating(true);
        try {
            const updated = await updatePredictedPart(
                predictionId,
                partId,
                payload
            );

            setData(prev =>
                prev.map(p =>
                    p.partId === partId ? updated : p
                )
            );

            return updated;
        } finally {
            setUpdating(false);
        }
    };

    // delete
    const remove = async (partId: number) => {
        setRemoving(true);
        try {
            await deletePredictedPart(predictionId, partId);

            setData(prev =>
                prev.filter(p => p.partId !== partId)
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