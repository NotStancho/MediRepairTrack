// hooks/useDefectCategories.ts

import { useCallback, useEffect, useState } from 'react';

import type { DefectCategory } from '../types/defectCategory/defectCategory';
import type {
    CreateDefectCategoryPayload,
    UpdateDefectCategoryPayload,
} from '../types/defectCategory/defectCategoryPayloads';

import {
    createDefectCategory,
    deleteDefectCategory,
    getAllDefectCategories,
    getDefectCategoryById,
    updateDefectCategory,
} from '../api/defectCategory';

export function useDefectCategories() {
    const [data, setData] = useState<DefectCategory[]>([]);
    const [loading, setLoading] = useState(true);

    const [selected, setSelected] = useState<DefectCategory | null>(null);
    const [selectedLoading, setSelectedLoading] = useState(false);

    const [creating, setCreating] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const load = useCallback(async (cancelled?: () => boolean) => {
        setLoading(true);
        try {
            const res = await getAllDefectCategories();
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
            const res = await getDefectCategoryById(id);
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

    const create = async (payload: CreateDefectCategoryPayload) => {
        setCreating(true);
        try {
            const created = await createDefectCategory(payload);
            setData(prev => [created, ...prev]);
            return created;
        } finally {
            setCreating(false);
        }
    };

    const update = async (id: number, payload: UpdateDefectCategoryPayload) => {
        setUpdating(true);
        try {
            const updated = await updateDefectCategory(id, payload);
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
            await deleteDefectCategory(id);
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

        refresh: load,
    };
}
