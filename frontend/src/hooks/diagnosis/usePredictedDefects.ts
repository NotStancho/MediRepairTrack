// hooks/diagnosis/dss/usePredictedDefects.ts

import { useCallback, useEffect, useState } from 'react';

import type { PredictedDefectCategory } from '../../types/diagnosis/DSS/predictedDefectCategory';
import type {
    CreatePredictedDefectPayload,
    UpdatePredictedDefectPayload
} from '../../types/diagnosis/DSS/predictedDefectCategoryPayload';

import type { DefectCategoryShort } from '../../types/defectCategory/defectCategoryShort';

import {
    createPredictedDefect,
    createPredictedDefectsBatch,
    getPredictedDefects,
    getAvailableDefects,
    updatePredictedDefect,
    deletePredictedDefect
} from '../../api/diagnosis/dss/predictedDefectCategory';

export function usePredictedDefects(predictionId: number) {
    const [data, setData] = useState<PredictedDefectCategory[]>([]);
    const [available, setAvailable] = useState<DefectCategoryShort[]>([]);

    const [loading, setLoading] = useState(true);

    const [creating, setCreating] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [removing, setRemoving] = useState(false);

    // 🔹 load main data
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
            const res = await getPredictedDefects(predictionId);
            if (!cancelled?.()) setData(res);
        } finally {
            if (!cancelled?.()) setLoading(false);
        }
    }, [predictionId]);

    // 🔹 load available
    const loadAvailable = useCallback(async () => {
        if (!predictionId) return;

        const res = await getAvailableDefects(predictionId);
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

    const create = async (payload: CreatePredictedDefectPayload) => {
        setCreating(true);
        try {
            const created = await createPredictedDefect(payload);

            setData(prev => [...prev, created]);

            await loadAvailable();

            return created;
        } finally {
            setCreating(false);
        }
    };

    // 🔹 batch create
    const createBatch = async (payload: CreatePredictedDefectPayload[]) => {
        setCreating(true);
        try {
            const created = await createPredictedDefectsBatch(payload);

            setData(prev => [...prev, ...created]);

            await loadAvailable(); // sync

            return created;
        } finally {
            setCreating(false);
        }
    };

    // update
    const update = async (
        defectCategoryId: number,
        payload: UpdatePredictedDefectPayload
    ) => {
        setUpdating(true);
        try {
            const updated = await updatePredictedDefect(
                predictionId,
                defectCategoryId,
                payload
            );

            setData(prev =>
                prev.map(d =>
                    d.defectCategory.id === defectCategoryId ? updated : d
                )
            );

            return updated;
        } finally {
            setUpdating(false);
        }
    };

    const remove = async (defectCategoryId: number) => {
        setRemoving(true);
        try {
            await deletePredictedDefect(predictionId, defectCategoryId);

            setData(prev =>
                prev.filter(d => d.defectCategory.id !== defectCategoryId)
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