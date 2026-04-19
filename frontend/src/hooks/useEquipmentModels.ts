// hooks/useEquipmentModels

import { useCallback, useEffect, useState } from 'react';

import type { EquipmentModel } from '../types/equipmentModel/equipmentModel';
import type { EquipmentModelShort } from '../types/equipmentModel/equipmentModelShort';
import type { EquipmentType } from '../types/equipmentModel/equipmentType';
import type {
    CreateEquipmentModelPayload,
    UpdateEquipmentModelPayload,
} from '../types/equipmentModel/equipmentModelPayloads';

import {
    getAllEquipmentModels,
    getAllEquipmentModelsShort,
    createEquipmentModel,
    updateEquipmentModel,
    deleteEquipmentModel,
    searchEquipmentModelsByName,
    searchEquipmentModelsByManufacturer,
    getEquipmentModelsByType,
} from '../api/equipmentModel';

export function useEquipmentModels() {
    const [data, setData] = useState<EquipmentModel[]>([]);
    const [loading, setLoading] = useState(true);

    const [shortData, setShortData] = useState<EquipmentModelShort[]>([]);
    const [shortLoading, setShortLoading] = useState(false);

    const [creating, setCreating] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const load = useCallback(async (cancelled?: () => boolean) => {
        setLoading(true);
        try {
            const res = await getAllEquipmentModels();
            if (!cancelled?.()) {
                setData(res);
            }
        } finally {
            if (!cancelled?.()) {
                setLoading(false);
            }
        }
    }, []);

    const loadShort = useCallback(async () => {
        setShortLoading(true);
        try {
            const res = await getAllEquipmentModelsShort();
            setShortData(res);
            return res;
        } finally {
            setShortLoading(false);
        }
    }, []);

    useEffect(() => {
        let cancelled = false;

        void load(() => cancelled);
        void loadShort();

        return () => {
            cancelled = true;
        };
    }, [load, loadShort]);

    const create = async (payload: CreateEquipmentModelPayload) => {
        setCreating(true);
        try {
            const created = await createEquipmentModel(payload);
            setData(prev => [created, ...prev]);
            return created;
        } finally {
            setCreating(false);
        }
    };

    const update = async (id: number, payload: UpdateEquipmentModelPayload) => {
        setUpdating(true);
        try {
            const updated = await updateEquipmentModel(id, payload);
            setData(prev =>
                prev.map(item => (item.id === id ? updated : item))
            );
            return updated;
        } finally {
            setUpdating(false);
        }
    };

    const remove = async (id: number) => {
        setDeletingId(id);
        try {
            await deleteEquipmentModel(id);
            setData(prev => prev.filter(item => item.id !== id));
        } finally {
            setDeletingId(null);
        }
    };

    const searchByName = async (q: string) => {
        setLoading(true);
        try {
            const res = await searchEquipmentModelsByName(q);
            setData(res);
            return res;
        } finally {
            setLoading(false);
        }
    };

    const searchByManufacturer = async (q: string) => {
        setLoading(true);
        try {
            const res = await searchEquipmentModelsByManufacturer(q);
            setData(res);
            return res;
        } finally {
            setLoading(false);
        }
    };

    const filterByType = async (type: EquipmentType) => {
        setLoading(true);
        try {
            const res = await getEquipmentModelsByType(type);
            setData(res);
            return res;
        } finally {
            setLoading(false);
        }
    };

    return {
        data,
        loading,

        shortData,
        shortLoading,
        loadShort,

        creating,
        updating,
        deletingId,

        create,
        update,
        remove,

        searchByName,
        searchByManufacturer,
        filterByType,

        refresh: load,
    };
}
