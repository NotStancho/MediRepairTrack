// components/claims/tabs/ClaimDiagnosisTab/ClaimDiagnosisTab.tsx

import { useState } from 'react';
import { FiActivity } from 'react-icons/fi';

import { useAuth } from '../../../../context/AuthContext';

import { useDiagnosis } from '../../../../hooks/diagnosis/useDiagnoses';
import DiagnosisList from './DiagnosisList';

import Button from '../../../../ui/Button';
import CreateDiagnosisModal from '../ClaimDiagnosisTab/modals/CreateDiagnosisModal';
import EditDiagnosisModal from '../ClaimDiagnosisTab/modals/EditDiagnosisModal';
import type { Diagnosis } from "../../../../types/diagnosis/diagnosis";

interface Props {
    claimId: number;
}

export default function ClaimDiagnosisTab({ claimId }: Props) {
    const { user } = useAuth();

    const isEngineer = user?.position === 'SERVICE_ENGINEER';
    const isManager = user?.position === 'MANAGER';

    const canCreate = isEngineer || isManager;

    const {
        data: diagnoses,
        loading,
        // creating,
        updating,

        confirmingId, rejectingId, archivingId, deletingId,
        confirm, reject, archive, remove,

        // createManual,
        // createAuto,

        update,

        allowedStatuses, allowedStatusesLoading, loadAllowedStatuses,

        refresh,
    } = useDiagnosis(claimId);

    const [selectedDiagnosisId, setSelectedDiagnosisId] = useState<number | null>(null);
    const [createOpen, setCreateOpen] = useState(false);
    const [editDiagnosis, setEditDiagnosis] = useState<Diagnosis | null>(null);

    if (loading) {
        return (
            <div className="rounded-lg border border-border bg-surface p-4 text-sm text-ink-muted">
                Завантаження діагностик…
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <section className="rounded-lg border border-border bg-surface p-4 shadow-sm">
                <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2">
                        <FiActivity className="text-brand" size={18} />
                        <h3 className="font-semibold text-ink">
                            Діагностика
                        </h3>
                    </div>

                    <div className="flex gap-2">
                        {canCreate && (
                            <Button variant="primary" onClick={() => setCreateOpen(true)}>
                                + Додати
                            </Button>
                        )}
                    </div>
                </div>

                <DiagnosisList
                    diagnoses={diagnoses}
                    selectedDiagnosisId={selectedDiagnosisId}

                    allowedStatuses={allowedStatuses}
                    allowedStatusesLoading={allowedStatusesLoading}

                    confirmingId={confirmingId}
                    rejectingId={rejectingId}
                    archivingId={archivingId}

                    onSelect={(id) =>
                        setSelectedDiagnosisId(prev => {
                            const next = prev === id ? null : id;
                            void loadAllowedStatuses(next);
                            return next;
                        })
                    }

                    onEdit={(diagnosis) => setEditDiagnosis(diagnosis)}

                    onConfirm={async (diagnosis) => {
                        if (!user?.employeeId) return;
                        await confirm(diagnosis.id, user.employeeId);
                        await loadAllowedStatuses(diagnosis.id);
                    }}

                    onReject={async (diagnosis) => {
                        await reject(diagnosis.id);
                        await loadAllowedStatuses(diagnosis.id);
                    }}

                    onArchive={async (diagnosis) => {
                        await archive(diagnosis.id);
                        await loadAllowedStatuses(diagnosis.id);
                    }}

                    deletingId={deletingId}
                    onDelete={async (diagnosis) => {
                        await remove(diagnosis.id);

                        setSelectedDiagnosisId(prev =>
                            prev === diagnosis.id ? null : prev
                        );
                    }}
                />
            </section>

            {createOpen && (
                <CreateDiagnosisModal
                    claimId={claimId}
                    onClose={() => setCreateOpen(false)}
                    onCreated={async (newDiagnosis) => {
                        setCreateOpen(false);
                        await refresh();
                        setSelectedDiagnosisId(newDiagnosis.id);
                        await loadAllowedStatuses(newDiagnosis.id);
                    }}
                />
            )}

            {editDiagnosis && (
                <EditDiagnosisModal
                    diagnosis={editDiagnosis}
                    updating={updating}
                    onClose={() => setEditDiagnosis(null)}
                    onSave={async (payload) => {
                        await update(editDiagnosis.id, payload);
                    }}
                />
            )}
        </div>
    );
}