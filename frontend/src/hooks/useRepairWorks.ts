// hooks/useRepairWorks.ts

import { useCallback, useEffect, useState } from 'react';

import type { RepairWork } from '../types/repairWork/repairWork';
import type {
    CreateRepairWorkPayload,
    UpdateRepairWorkPayload,
} from '../types/repairWork/repairWorkPayloads';

import {
    createRepairWork,
    deleteRepairWork,
    getAllRepairWorks,
    getRepairWorkById,
    updateRepairWork,
} from '../api/repairWork';

export function useRepairWorks() {
    const [data, setData] = useState<RepairWork[]>([]);
    const [loading, setLoading] = useState(true);

    const [selected, setSelected] = useState<RepairWork | null>(null);
    const [selectedLoading, setSelectedLoading] = useState(false);

    const [creating, setCreating] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const load = useCallback(async (cancelled?: () => boolean) => {
        setLoading(true);
        try {
            const res = await getAllRepairWorks();
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
            const res = await getRepairWorkById(id);
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

    const create = async (
        payload: CreateRepairWorkPayload,
        employeeId: number
    ) => {
        setCreating(true);
        try {
            const created = await createRepairWork(payload, employeeId);
            setData(prev => [created, ...prev]);
            return created;
        } finally {
            setCreating(false);
        }
    };

    const update = async (id: number, payload: UpdateRepairWorkPayload) => {
        setUpdating(true);
        try {
            const updated = await updateRepairWork(id, payload);
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
            await deleteRepairWork(id);
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
