// hooks/diagnosis/useDiagnoses.ts

import { useCallback, useEffect, useState } from 'react';
import type { Diagnosis } from '../../types/diagnosis/diagnosis';

import {
    getDiagnosesByClaim,
    createManualDiagnosis,
    createAutoDiagnosis,
    updateDiagnosis,
    confirmDiagnosis,
    rejectDiagnosis,
    archiveDiagnosis
} from '../../api/diagnosis/diagnosis';

import type {
    CreateManualDiagnosisPayload,
    UpdateDiagnosisPayload
} from '../../types/diagnosis/diagnosisPayloads';

export function useDiagnosis(claimId: number) {
    const [data, setData] = useState<Diagnosis[]>([]);
    const [loading, setLoading] = useState(true);

    const [creating, setCreating] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [confirming, setConfirming] = useState(false);
    const [rejecting, setRejecting] = useState(false);
    const [archiving, setArchiving] = useState(false);

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

    const createAuto = async (claimId: number) => {
        setCreating(true);
        try {
            const created = await createAutoDiagnosis(claimId);
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

    const confirm = async (id: number, engineerId: number) => {
        setConfirming(true);
        try {
            const updated = await confirmDiagnosis(id, engineerId);
            setData(prev =>
                prev.map(d => (d.id === id ? updated : d))
            );
            return updated;
        } finally {
            setConfirming(false);
        }
    };

    const reject = async (id: number) => {
        setRejecting(true);
        try {
            const updated = await rejectDiagnosis(id);
            setData(prev =>
                prev.map(d => (d.id === id ? updated : d))
            );
            return updated;
        } finally {
            setRejecting(false);
        }
    };

    const archive = async (id: number) => {
        setArchiving(true);
        try {
            const updated = await archiveDiagnosis(id);
            setData(prev =>
                prev.map(d => (d.id === id ? updated : d))
            );
            return updated;
        } finally {
            setArchiving(false);
        }
    };

    return {
        data,
        loading,

        creating,
        updating,
        confirming,
        rejecting,
        archiving,

        createManual,
        createAuto,
        update,
        confirm,
        reject,
        archive,

        refresh: load
    };
}