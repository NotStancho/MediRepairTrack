// hooks/useClientSearch
import { useEffect, useState } from 'react';
import { searchClientsPrefix } from '../api/client';
import type { ClientSearch } from '../types/client/ClientSearch';

export function useClientSearch(query: string) {
    const [clients, setClients] = useState<ClientSearch[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (query.trim().length < 2) {
            setClients([]);
            return;
        }

        setLoading(true);

        const timeout = setTimeout(async () => {
            try {
                const res = await searchClientsPrefix(query);
                setClients(res);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(timeout);
    }, [query]);

    return {
        clients,
        loading
    };
}
