// hooks/diagnosis/usePredictions.ts

import { useEffect, useState, useCallback } from 'react';
import type { DiagnosisPrediction } from '../../types/diagnosis/DSS/diagnosisPrediction';

import {
    getPredictionsByDiagnosis,
    createManualPrediction,
    updatePrediction,
    deletePrediction,
    recalculatePrediction
} from '../../api/diagnosis/dss/diagnosisPrediction';

import type {
    CreateManualPredictionPayload,
    UpdatePredictionPayload
} from '../../types/diagnosis/DSS/diagnosisPredictionPayloads';

export function usePredictions(diagnosisId: number) {
    const [data, setData] = useState<DiagnosisPrediction[]>([]);
    const [loading, setLoading] = useState(true);

    const [creating, setCreating] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [removing, setRemoving] = useState(false);
    const [recalculating, setRecalculating] = useState(false);

    const load = useCallback(async (cancelled?: () => boolean) => {
        if (!diagnosisId) {
            if (!cancelled?.()) {
                setData([]);
                setLoading(false);
            }
            return;
        }

        setLoading(true);
        try {
            const res = await getPredictionsByDiagnosis(diagnosisId);
            if (!cancelled?.()) setData(res);
        } finally {
            if (!cancelled?.()) setLoading(false);
        }
    }, [diagnosisId]);

    useEffect(() => {
        let cancelled = false;

        void load(() => cancelled);

        return () => {
            cancelled = true;
        };
    }, [load]);

    const create = async (payload: CreateManualPredictionPayload) => {
        setCreating(true);
        try {
            const created = await createManualPrediction(payload);
            setData(prev => [created, ...prev]);
            return created;
        } finally {
            setCreating(false);
        }
    };

    const update = async (id: number, payload: UpdatePredictionPayload) => {
        setUpdating(true);
        try {
            const updated = await updatePrediction(id, payload);
            setData(prev =>
                prev.map(p => (p.id === id ? updated : p))
            );
            return updated;
        } finally {
            setUpdating(false);
        }
    };

    const remove = async (id: number) => {
        setRemoving(true);
        try {
            await deletePrediction(id);
            setData(prev => prev.filter(p => p.id !== id));
        } finally {
            setRemoving(false);
        }
    };

    const recalculate = async (id: number) => {
        setRecalculating(true);
        try {
            await recalculatePrediction(id);
            await load();
        } finally {
            setRecalculating(false);
        }
    };

    return {
        data,
        loading,

        creating,
        updating,
        removing,
        recalculating,

        create,
        update,
        remove,
        recalculate,

        refresh: load
    };
}