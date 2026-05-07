// hooks/diagnosis/usePredictedWorkParts.ts

import { useCallback, useEffect, useState } from 'react';
import type { PredictedWorkPart } from '../../types/diagnosis/DSS/predictedWorkPart';
import type {
    CreatePredictedWorkPartPayload,
    UpdatePredictedWorkPartPayload
} from '../../types/diagnosis/DSS/predictedWorkPartPayloads';
import type { PartShort } from '../../types/part/partShort';

import {
    createPredictedWorkPart,
    createPredictedWorkPartsBatch,
    getPredictedWorkParts,
    getPredictedWorkPartsByWork,
    getAvailablePartsForPredictedWork,
    updatePredictedWorkPart,
    deletePredictedWorkPart
} from '../../api/diagnosis/dss/predictedWorkPart';

function sortPredictedWorkParts(items: PredictedWorkPart[]) {
    return [...items].sort((left, right) => {
        if (left.repairWorkId !== right.repairWorkId) {
            return left.repairWorkId - right.repairWorkId;
        }

        return (left.rankPosition ?? 0) - (right.rankPosition ?? 0);
    });
}

export function usePredictedWorkParts(
    predictionId: number,
    repairWorkId?: number | null
) {
    const [data, setData] = useState<PredictedWorkPart[]>([]);
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
            const res = repairWorkId != null
                ? await getPredictedWorkPartsByWork(predictionId, repairWorkId)
                : await getPredictedWorkParts(predictionId);

            if (!cancelled?.()) setData(sortPredictedWorkParts(res));
        } finally {
            if (!cancelled?.()) setLoading(false);
        }
    }, [predictionId, repairWorkId]);

    // load available parts
    const loadAvailable = useCallback(async () => {
        if (!predictionId || repairWorkId == null) {
            setAvailable([]);
            return;
        }

        const res = await getAvailablePartsForPredictedWork(predictionId, repairWorkId);
        setAvailable(res);
    }, [predictionId, repairWorkId]);

    useEffect(() => {
        let cancelled = false;

        void load(() => cancelled);
        void loadAvailable();

        return () => {
            cancelled = true;
        };
    }, [load, loadAvailable]);

    const create = async (payload: CreatePredictedWorkPartPayload) => {
        setCreating(true);
        try {
            const created = await createPredictedWorkPart(payload);
            setData(prev => sortPredictedWorkParts([...prev, created]));

            await loadAvailable(); // sync

            return created;
        } finally {
            setCreating(false);
        }
    };

    const createBatch = async (payload: CreatePredictedWorkPartPayload[]) => {
        setCreating(true);
        try {
            const created = await createPredictedWorkPartsBatch(payload);
            setData(prev => sortPredictedWorkParts([...prev, ...created]));

            await loadAvailable(); // sync

            return created;
        } finally {
            setCreating(false);
        }
    };

    const update = async (
        targetRepairWorkId: number,
        partId: number,
        payload: UpdatePredictedWorkPartPayload
    ) => {
        setUpdating(true);
        try {
            const updated = await updatePredictedWorkPart(
                predictionId,
                targetRepairWorkId,
                partId,
                payload
            );

            setData(prev => sortPredictedWorkParts(
                prev.map(p =>
                    p.repairWorkId === targetRepairWorkId && p.part.id === partId
                        ? updated
                        : p
                )
            ));

            return updated;
        } finally {
            setUpdating(false);
        }
    };

    // delete
    const remove = async (targetRepairWorkId: number, partId: number) => {
        setRemoving(true);
        try {
            await deletePredictedWorkPart(predictionId, targetRepairWorkId, partId);

            setData(prev => sortPredictedWorkParts(
                prev.filter(p =>
                    !(p.repairWorkId === targetRepairWorkId && p.part.id === partId)
                )
            ));

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
