// hooks/useClientContracts.ts

import { useCallback, useEffect, useState } from 'react';

import type { ClientContract } from '../types/clientContract/clientContract';
import type {
    CreateClientContractPayload,
    UpdateClientContractPayload,
} from '../types/clientContract/clientContractPayloads';

import {
    createClientContract,
    deleteClientContract,
    getAllClientContracts,
    getClientContractById,
    updateClientContract,
} from '../api/clientContract';

export function useClientContracts() {
    const [data, setData] = useState<ClientContract[]>([]);
    const [loading, setLoading] = useState(true);

    const [selected, setSelected] = useState<ClientContract | null>(null);
    const [selectedLoading, setSelectedLoading] = useState(false);

    const [creating, setCreating] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const load = useCallback(async (cancelled?: () => boolean) => {
        setLoading(true);
        try {
            const res = await getAllClientContracts();
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
            const res = await getClientContractById(id);
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

    const create = async (payload: CreateClientContractPayload) => {
        setCreating(true);
        try {
            const created = await createClientContract(payload);
            setData(prev => [created, ...prev]);
            return created;
        } finally {
            setCreating(false);
        }
    };

    const update = async (id: number, payload: UpdateClientContractPayload) => {
        setUpdating(true);
        try {
            const updated = await updateClientContract(id, payload);
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
            await deleteClientContract(id);
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
