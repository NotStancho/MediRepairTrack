// hooks/diagnosis/dss/useComplexityLevels.ts

import { useCallback, useEffect, useState } from 'react';

import type { ComplexityLevel } from '../../types/diagnosis/DSS/complexityLevel';
import type {
    CreateComplexityLevelPayload,
    UpdateComplexityLevelPayload,
} from '../../types/diagnosis/DSS/complexityLevelPayloads';

import {
    createComplexityLevel,
    deleteComplexityLevel,
    getComplexityLevelById,
    getComplexityLevels,
    updateComplexityLevel,
} from '../../api/diagnosis/dss/complexityLevel';

export function useComplexityLevels() {
    const [data, setData] = useState<ComplexityLevel[]>([]);
    const [loading, setLoading] = useState(true);

    const [selected, setSelected] = useState<ComplexityLevel | null>(null);
    const [selectedLoading, setSelectedLoading] = useState(false);

    const [creating, setCreating] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const load = useCallback(async (cancelled?: () => boolean) => {
        setLoading(true);
        try {
            const res = await getComplexityLevels();
            if (!cancelled?.()) {
                setData(res);
            }
        } finally {
            if (!cancelled?.()) {
                setLoading(false);
            }
        }
    }, []);

    const loadOne = async (id: number | null) => {
        if (!id) {
            setSelected(null);
            return null;
        }

        setSelectedLoading(true);
        try {
            const res = await getComplexityLevelById(id);
            setSelected(res);
            return res;
        } finally {
            setSelectedLoading(false);
        }
    };

    useEffect(() => {
        let cancelled = false;

        void load(() => cancelled);

        return () => {
            cancelled = true;
        };
    }, [load]);

    const create = async (payload: CreateComplexityLevelPayload) => {
        setCreating(true);
        try {
            const created = await createComplexityLevel(payload);

            setData(prev => [created, ...prev]);

            return created;
        } finally {
            setCreating(false);
        }
    };

    const update = async (id: number, payload: UpdateComplexityLevelPayload) => {
        setUpdating(true);
        try {
            const updated = await updateComplexityLevel(id, payload);
            setData(prev =>
                prev.map(item => (item.id === id ? updated : item))
            );

            if (selected?.id === id) {
                setSelected(updated);
            }

            return updated;
        } finally {
            setUpdating(false);
        }
    };

    const remove = async (id: number) => {
        setDeletingId(id);
        try {
            await deleteComplexityLevel(id);
            setData(prev => prev.filter(item => item.id !== id));

            if (selected?.id === id) {
                setSelected(null);
            }
        } finally {
            setDeletingId(null);
        }
    };

    return {
        data,
        loading,

        selected,
        selectedLoading,
        loadOne,

        creating,
        updating,
        deletingId,

        create,
        update,
        remove,

        refresh: load
    };
}
