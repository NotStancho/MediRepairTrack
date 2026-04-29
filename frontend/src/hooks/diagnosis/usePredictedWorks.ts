// hooks/diagnosis/dss/usePredictedWorks.ts

import { useCallback, useEffect, useState } from 'react';
import type { PredictedWork } from '../../types/diagnosis/DSS/predictedWork';
import type {
    CreatePredictedWorkPayload,
    UpdatePredictedWorkPayload
} from '../../types/diagnosis/DSS/predictedWorkPayloads';
import type { RepairWorkShort } from '../../types/repairWork/repairWorkShort';

import {
    createPredictedWork,
    createPredictedWorksBatch,
    getPredictedWorks,
    getAvailableWorks,
    updatePredictedWork,
    deletePredictedWork
} from '../../api/diagnosis/dss/predictedWorks';

export function usePredictedWorks(predictionId: number) {
    const [data, setData] = useState<PredictedWork[]>([]);
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
            const res = await getPredictedWorks(predictionId);
            if (!cancelled?.()) setData(res);
        } finally {
            if (!cancelled?.()) setLoading(false);
        }
    }, [predictionId]);

    // load available works
    const loadAvailable = useCallback(async () => {
        if (!predictionId) return;

        const res = await getAvailableWorks(predictionId);
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

    const create = async (payload: CreatePredictedWorkPayload) => {
        setCreating(true);
        try {
            const created = await createPredictedWork(payload);
            setData(prev => [...prev, created]);
            await loadAvailable(); // sync
            return created;
        } finally {
            setCreating(false);
        }
    };

    const createBatch = async (payload: CreatePredictedWorkPayload[]) => {
        setCreating(true);
        try {
            const created = await createPredictedWorksBatch(payload);
            setData(prev => [...prev, ...created]);
            await loadAvailable(); // sync
            return created;
        } finally {
            setCreating(false);
        }
    };

    const update = async (
        repairWorkId: number,
        payload: UpdatePredictedWorkPayload
    ) => {
        setUpdating(true);
        try {
            const updated = await updatePredictedWork(
                predictionId,
                repairWorkId,
                payload
            );

            setData(prev =>
                prev.map(work =>
                    work.repairWork.id === repairWorkId ? updated : work
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
            await deletePredictedWork(predictionId, repairWorkId);

            setData(prev =>
                prev.filter(work => work.repairWork.id !== repairWorkId)
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
