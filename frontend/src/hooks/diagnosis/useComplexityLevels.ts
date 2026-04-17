// hooks/diagnosis/dss/useComplexityLevels.ts

import { useCallback, useEffect, useState } from 'react';

import type { ComplexityLevel } from '../../types/diagnosis/DSS/complexityLevel';
import type { CreateComplexityLevelPayload } from '../../types/diagnosis/DSS/complexityLevelPayloads';

import {
    getComplexityLevels,
    createComplexityLevel
} from '../../api/diagnosis/dss/complexityLevel';

export function useComplexityLevels() {
    const [data, setData] = useState<ComplexityLevel[]>([]);
    const [loading, setLoading] = useState(true);

    const [creating, setCreating] = useState(false);

    // load
    const load = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getComplexityLevels();
            setData(res);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void load();
    }, [load]);

    const create = async (payload: CreateComplexityLevelPayload) => {
        setCreating(true);
        try {
            const created = await createComplexityLevel(payload);

            // adding in list
            setData(prev => [...prev, created]);

            return created;
        } finally {
            setCreating(false);
        }
    };

    return {
        data,
        loading,

        creating,

        create,

        refresh: load
    };
}