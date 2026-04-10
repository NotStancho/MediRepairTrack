// hooks/diagnosis/useDiagnoses.ts

import { useCallback, useEffect, useState } from 'react';
import type {Diagnosis, DiagnosisStatus} from '../../types/diagnosis/diagnosis';

import {
    getDiagnosesByClaim,
    getAllowedDiagnosisStatuses,
    createManualDiagnosis,
    createAutoDiagnosis,
    updateDiagnosis,
    deleteDiagnosis,
    confirmDiagnosis,
    rejectDiagnosis,
    archiveDiagnosis
} from '../../api/diagnosis/diagnosis';

import type {
    CreateAutoDiagnosisPayload,
    CreateManualDiagnosisPayload,
    UpdateDiagnosisPayload
} from '../../types/diagnosis/diagnosisPayloads';

export function useDiagnosis(claimId: number) {
    const [data, setData] = useState<Diagnosis[]>([]);
    const [loading, setLoading] = useState(true);

    const [creating, setCreating] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const [confirmingId, setConfirmingId] = useState<number | null>(null);
    const [rejectingId, setRejectingId] = useState<number | null>(null);
    const [archivingId, setArchivingId] = useState<number | null>(null);

    const [allowedStatuses, setAllowedStatuses] = useState<DiagnosisStatus[]>([]);
    const [allowedStatusesLoading, setAllowedStatusesLoading] = useState(false);

    const load = useCallback(async (cancelled?: () => boolean) => {
        if (!claimId) {
            if (!cancelled?.()) {
                setData([]);
                setLoading(false);
            }
            return;
        }

        setLoading(true);
        try {
            const res = await getDiagnosesByClaim(claimId);
            if (!cancelled?.()) setData(res);
        } finally {
            if (!cancelled?.()) setLoading(false);
        }
    }, [claimId]);

    const loadAllowedStatuses = async (diagnosisId: number | null) => {
        if (!diagnosisId) {
            setAllowedStatuses([]);
            return;
        }

        setAllowedStatusesLoading(true);
        try {
            const res = await getAllowedDiagnosisStatuses(diagnosisId);
            setAllowedStatuses(res);
        } finally {
            setAllowedStatusesLoading(false);
        }
    };

    useEffect(() => {
        let cancelled = false;

        void load(() => cancelled);

        return () => {
            cancelled = true;
        };
    }, [load]);

    const createManual = async (payload: CreateManualDiagnosisPayload) => {
        setCreating(true);
        try {
            const created = await createManualDiagnosis(payload);
            setData(prev => [created, ...prev]);
            return created;
        } finally {
            setCreating(false);
        }
    };

    const createAuto = async (payload: CreateAutoDiagnosisPayload) => {
        setCreating(true);
        try {
            const created = await createAutoDiagnosis(payload);
            setData(prev => [created, ...prev]);
            return created;
        } finally {
            setCreating(false);
        }
    };

    const update = async (id: number, payload: UpdateDiagnosisPayload) => {
        setUpdating(true);
        try {
            const updated = await updateDiagnosis(id, payload);
            setData(prev =>
                prev.map(d => (d.id === id ? updated : d))
            );
            return updated;
        } finally {
            setUpdating(false);
        }
    };

    const remove = async (id: number) => {
        setDeletingId(id);
        try {
            await deleteDiagnosis(id);
            setData(prev => prev.filter(d => d.id !== id));
        } finally {
            setDeletingId(null);
        }
    };

    const confirm = async (id: number, engineerId: number) => {
        setConfirmingId(id);
        try {
            const updated = await confirmDiagnosis(id, engineerId);
            setData(prev =>
                prev.map(d => (d.id === id ? updated : d))
            );
            return updated;
        } finally {
            setConfirmingId(null);
        }
    };

    const reject = async (id: number) => {
        setRejectingId(id);
        try {
            const updated = await rejectDiagnosis(id);
            setData(prev =>
                prev.map(d => (d.id === id ? updated : d))
            );
            return updated;
        } finally {
            setRejectingId(null);
        }
    };

    const archive = async (id: number) => {
        setArchivingId(id);
        try {
            const updated = await archiveDiagnosis(id);
            setData(prev =>
                prev.map(d => (d.id === id ? updated : d))
            );
            return updated;
        } finally {
            setArchivingId(null);
        }
    };

    return {
        data,
        loading,

        creating,
        updating,
        remove,


        confirmingId,
        rejectingId,
        archivingId,
        deletingId,

        createManual,
        createAuto,
        update,
        confirm,
        reject,
        archive,

        allowedStatuses,
        allowedStatusesLoading,
        loadAllowedStatuses,

        refresh: load
    };
}