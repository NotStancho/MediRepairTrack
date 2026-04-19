// hooks/useRepairOperations.ts

import { useCallback, useEffect, useState } from 'react';

import type { RepairOperation } from '../types/repairOperation/repairOperation';
import type {
    CreateRepairOperationPayload,
    UpdateRepairOperationPayload,
} from '../types/repairOperation/repairOperationPayloads';

import {
    createRepairOperation,
    deleteRepairOperation,
    getAllRepairOperations,
    getRepairOperationById,
    updateRepairOperation,
} from '../api/repairOperation';

export function useRepairOperations() {
    const [data, setData] = useState<RepairOperation[]>([]);
    const [loading, setLoading] = useState(true);

    const [selected, setSelected] = useState<RepairOperation | null>(null);
    const [selectedLoading, setSelectedLoading] = useState(false);

    const [creating, setCreating] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const load = useCallback(async (cancelled?: () => boolean) => {
        setLoading(true);
        try {
            const res = await getAllRepairOperations();
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
            const res = await getRepairOperationById(id);
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
        payload: CreateRepairOperationPayload,
        employeeId: number
    ) => {
        setCreating(true);
        try {
            const created = await createRepairOperation(payload, employeeId);
            setData(prev => [created, ...prev]);
            return created;
        } finally {
            setCreating(false);
        }
    };

    const update = async (id: number, payload: UpdateRepairOperationPayload) => {
        setUpdating(true);
        try {
            const updated = await updateRepairOperation(id, payload);
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
            await deleteRepairOperation(id);
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
