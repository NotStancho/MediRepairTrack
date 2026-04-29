// hooks/diagnosis/dss/usePredictedOperations.ts

import { useCallback, useEffect, useState } from 'react';
import type { PredictedOperation } from '../../types/diagnosis/DSS/predictedOperation';
import type {
    CreatePredictedOperationPayload,
    UpdatePredictedOperationPayload
} from '../../types/diagnosis/DSS/predictedOperationPayloads';
import type { RepairWorkShort } from '../../types/repairWork/repairWorkShort';

import {
    createPredictedOperation,
    createPredictedOperationsBatch,
    getPredictedOperations,
    getAvailableOperations,
    updatePredictedOperation,
    deletePredictedOperation
} from '../../api/diagnosis/dss/predictedOperations';

export function usePredictedOperations(predictionId: number) {
    const [data, setData] = useState<PredictedOperation[]>([]);
    const [available, setAvailable] = useState<RepairWorkShort[]>([]);

    const [loading, setLoading] = useState(true);

    const [creating, setCreating] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [removing, setRemoving] = useState(false);

    // load main data
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
            const res = await getPredictedOperations(predictionId);
            if (!cancelled?.()) setData(res);
        } finally {
            if (!cancelled?.()) setLoading(false);
        }
    }, [predictionId]);

    // load available operations
    const loadAvailable = useCallback(async () => {
        if (!predictionId) return;

        const res = await getAvailableOperations(predictionId);
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

    const create = async (payload: CreatePredictedOperationPayload) => {
        setCreating(true);
        try {
            const created = await createPredictedOperation(payload);
            setData(prev => [...prev, created]);
            await loadAvailable(); // sync
            return created;
        } finally {
            setCreating(false);
        }
    };

    const createBatch = async (payload: CreatePredictedOperationPayload[]) => {
        setCreating(true);
        try {
            const created = await createPredictedOperationsBatch(payload);
            setData(prev => [...prev, ...created]);
            await loadAvailable(); // sync
            return created;
        } finally {
            setCreating(false);
        }
    };

    const update = async (
        repairWorkId: number,
        payload: UpdatePredictedOperationPayload
    ) => {
        setUpdating(true);
        try {
            const updated = await updatePredictedOperation(
                predictionId,
                repairWorkId,
                payload
            );

            setData(prev =>
                prev.map(op =>
                    op.repairWork.id === repairWorkId ? updated : op
                )
            );

            return updated;
        } finally {
            setUpdating(false);
        }
    };

    const remove = async (repairWorkId: number) => {
        setRemoving(true);
        try {
            await deletePredictedOperation(predictionId, repairWorkId);

            setData(prev =>
                prev.filter(op => op.repairWork.id !== repairWorkId)
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
