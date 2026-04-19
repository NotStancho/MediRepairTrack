// hooks/useEquipment.ts

import { useCallback, useEffect, useState } from 'react';

import type { Equipment } from '../types/equipment/equipment';
import type { EquipmentFull } from '../types/equipment/equipmentFull';
import type {
    CreateEquipmentPayload,
    UpdateEquipmentPayload,
} from '../types/equipment/equipmentPayloads';

import {
    getAllEquipment,
    getEquipmentFullById,
    createEquipment,
    updateEquipment,
    deleteEquipment,
} from '../api/equipment';

export function useEquipment() {
    const [data, setData] = useState<Equipment[]>([]);
    const [loading, setLoading] = useState(true);

    const [selectedFull, setSelectedFull] = useState<EquipmentFull | null>(null);
    const [selectedFullLoading, setSelectedFullLoading] = useState(false);

    const [creating, setCreating] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const load = useCallback(async (cancelled?: () => boolean) => {
        setLoading(true);
        try {
            const res = await getAllEquipment();
            if (!cancelled?.()) {
                setData(res);
            }
        } finally {
            if (!cancelled?.()) {
                setLoading(false);
            }
        }
    }, []);

    const loadFull = async (id: number | null) => {
        if (!id) {
            setSelectedFull(null);
            return;
        }

        setSelectedFullLoading(true);
        try {
            const res = await getEquipmentFullById(id);
            setSelectedFull(res);
            return res;
        } finally {
            setSelectedFullLoading(false);
        }
    };

    useEffect(() => {
        let cancelled = false;

        void load(() => cancelled);

        return () => {
            cancelled = true;
        };
    }, [load]);

    const create = async (payload: CreateEquipmentPayload) => {
        setCreating(true);
        try {
            const created = await createEquipment(payload);
            setData(prev => [created, ...prev]);
            return created;
        } finally {
            setCreating(false);
        }
    };

    const update = async (id: number, payload: UpdateEquipmentPayload) => {
        setUpdating(true);
        try {
            const updated = await updateEquipment(id, payload);

            setData(prev =>
                prev.map(item => (item.id === id ? updated : item))
            );

            if (selectedFull?.id === id) {
                await loadFull(id);
            }

            return updated;
        } finally {
            setUpdating(false);
        }
    };

    const remove = async (id: number) => {
        setDeletingId(id);
        try {
            await deleteEquipment(id);

            setData(prev => prev.filter(item => item.id !== id));

            if (selectedFull?.id === id) {
                setSelectedFull(null);
            }
        } finally {
            setDeletingId(null);
        }
    };

    return {
        data,
        loading,

        selectedFull,
        selectedFullLoading,
        loadFull,

        creating,
        updating,
        deletingId,

        create,
        update,
        remove,

        refresh: load,
    };
}