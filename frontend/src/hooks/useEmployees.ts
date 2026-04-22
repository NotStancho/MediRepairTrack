// hooks/useEmployees.ts

import { useCallback, useEffect, useState } from 'react';

import type {
    Employee,
    EmployeeFull,
} from '../types/employee/employee';

import type {
    RegisterEmployeeWithUserPayload,
    UpdateEmployeePayload
} from '../types/employee/employeePayload';


import {
    deleteEmployee,
    getAllEmployees,
    getEmployeeFullById,
    registerEmployeeWithUser,
    updateEmployee,
} from '../api/employee';

export function useEmployees() {
    const [data, setData] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);

    const [selectedFull, setSelectedFull] = useState<EmployeeFull | null>(null);
    const [selectedFullLoading, setSelectedFullLoading] = useState(false);

    const [creating, setCreating] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const load = useCallback(async (cancelled?: () => boolean) => {
        setLoading(true);
        try {
            const res = await getAllEmployees();
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
            const res = await getEmployeeFullById(id);
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

    const create = async (payload: RegisterEmployeeWithUserPayload) => {
        setCreating(true);
        try {
            const created = await registerEmployeeWithUser(payload);
            setData(prev => [created, ...prev]);
            return created;
        } finally {
            setCreating(false);
        }
    };

    const update = async (id: number, payload: UpdateEmployeePayload) => {
        setUpdating(true);
        try {
            const updated = await updateEmployee(id, payload);

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
            await deleteEmployee(id);

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
