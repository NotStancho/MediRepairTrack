//hooks/usePart.ts

import { useCallback, useEffect, useState } from 'react';

import type { Part } from '../types/part/part';
import type {
    AddPartStockPayload,
    CreatePartPayload,
    UpdatePartPayload,
} from '../types/part/partPayloads';

import {
    addPartStock,
    createPart,
    deletePart,
    getAllParts,
    getPartById,
    updatePart,
} from '../api/part';

export function usePart() {
    const [data, setData] = useState<Part[]>([]);
    const [loading, setLoading] = useState(true);

    const [selected, setSelected] = useState<Part | null>(null);
    const [selectedLoading, setSelectedLoading] = useState(false);

    const [creating, setCreating] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [addingStockId, setAddingStockId] = useState<number | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const load = useCallback(async (cancelled?: () => boolean) => {
        setLoading(true);
        try {
            const res = await getAllParts();
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
            const res = await getPartById(id);
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

    const create = async (payload: CreatePartPayload) => {
        setCreating(true);
        try {
            const created = await createPart(payload);
            setData(prev => [created, ...prev]);
            return created;
        } finally {
            setCreating(false);
        }
    };

    const update = async (id: number, payload: UpdatePartPayload) => {
        setUpdating(true);
        try {
            const updated = await updatePart(id, payload);
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

    const addStock = async (id: number, payload: AddPartStockPayload) => {
        setAddingStockId(id);
        try {
            const updated = await addPartStock(id, payload);
            setData(prev =>
                prev.map(item => (item.id === id ? updated : item))
            );

            if (selected?.id === id) {
                setSelected(updated);
            }

            return updated;
        } finally {
            setAddingStockId(null);
        }
    };

    const remove = async (id: number) => {
        setDeletingId(id);
        try {
            await deletePart(id);
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
        addingStockId,
        deletingId,

        create,
        update,
        addStock,
        remove,

        refresh: load,
    };
}
