import { useCallback, useEffect, useState } from 'react';

import type { Client } from '../types/client/client';
import type { ClientFull } from '../types/client/clientFull';
import type {
    CreateClientPayload,
    UpdateClientPayload,
} from '../types/client/clientPayloads';

import {
    createClient,
    deleteClient,
    getAllClients,
    getClientFullById,
    updateClient,
} from '../api/client';

export function useClients() {
    const [data, setData] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);

    const [selectedFull, setSelectedFull] = useState<ClientFull | null>(null);
    const [selectedFullLoading, setSelectedFullLoading] = useState(false);

    const [creating, setCreating] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const load = useCallback(async (cancelled?: () => boolean) => {
        setLoading(true);
        try {
            const res = await getAllClients();
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
            return null;
        }

        setSelectedFullLoading(true);
        try {
            const res = await getClientFullById(id);
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

    const create = async (payload: CreateClientPayload) => {
        setCreating(true);
        try {
            const created = await createClient(payload);
            setData(prev => [created, ...prev]);
            return created;
        } finally {
            setCreating(false);
        }
    };

    const update = async (id: number, payload: UpdateClientPayload) => {
        setUpdating(true);
        try {
            const updated = await updateClient(id, payload);

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
            await deleteClient(id);

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
