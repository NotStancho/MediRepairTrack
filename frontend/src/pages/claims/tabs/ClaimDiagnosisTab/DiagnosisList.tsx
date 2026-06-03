// pages/claims/tabs/ClaimDiagnosisTab/DiagnosisList.tsx

import { useState } from 'react';
import type { Diagnosis, DiagnosisStatus } from '../../../../types/diagnosis/diagnosis';
import type { CreateManualPredictionPayload} from '../../../../types/diagnosis/DSS/diagnosisPredictionPayloads';
import DiagnosisCard from './DiagnosisCard';

interface Props {
    diagnoses: Diagnosis[];
    selectedDiagnosisId: number | null;

    allowedStatuses: DiagnosisStatus[];
    allowedStatusesLoading: boolean;

    onSelect: (id: number) => void;
    onEdit: (diagnosis: Diagnosis) => void;

    confirmingId: number | null;
    rejectingId: number | null;
    archivingId: number | null;
    deletingId: number | null;

    onConfirm: (diagnosis: Diagnosis) => Promise<void>;
    onReject: (diagnosis: Diagnosis) => Promise<void>;
    onArchive: (diagnosis: Diagnosis) => Promise<void>;
    onDelete: (diagnosis: Diagnosis) => void;

    creatingPrediction: boolean;
    onCreatePrediction: (payload: CreateManualPredictionPayload) => Promise<void>;
}

export default function DiagnosisList({
                                          diagnoses,
                                          selectedDiagnosisId,

                                          onSelect,
                                          onEdit,

                                          allowedStatuses, allowedStatusesLoading,

                                          confirmingId, rejectingId, archivingId, deletingId,
                                          onConfirm, onReject, onArchive, onDelete,

                                          creatingPrediction, onCreatePrediction,
                                      }: Props) {
    const [openPredictionIds, setOpenPredictionIds] = useState<Set<number>>(() => new Set());

    const togglePrediction = (id: number) => {
        setOpenPredictionIds(prev => {
            const next = new Set(prev);

            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }

            return next;
        });
        onSelect(id);
    };

    if (!diagnoses.length) {
        return (
            <div className="text-sm text-ink-muted italic">
                Для цієї заявки ще немає жодної діагностики
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {diagnoses.map((diagnosis) => (
                <DiagnosisCard
                    key={diagnosis.id}
                    diagnosis={diagnosis}
                    selected={diagnosis.id === selectedDiagnosisId}
                    onClick={() => onSelect(diagnosis.id)}
                    onEdit={() => onEdit(diagnosis)}

                    allowedStatuses={
                        diagnosis.id === selectedDiagnosisId ? allowedStatuses : []
                    }
                    allowedStatusesLoading={
                        diagnosis.id === selectedDiagnosisId ? allowedStatusesLoading : false
                    }

                    confirming={confirmingId === diagnosis.id}
                    rejecting={rejectingId === diagnosis.id}
                    archiving={archivingId === diagnosis.id}
                    deleting={deletingId === diagnosis.id}

                    onConfirm={() => onConfirm(diagnosis)}
                    onReject={() => onReject(diagnosis)}
                    onArchive={() => onArchive(diagnosis)}
                    onDelete={() => {
                        onDelete(diagnosis);
                        setOpenPredictionIds(prev => {
                            const next = new Set(prev);
                            next.delete(diagnosis.id);
                            return next;
                        });
                    }}

                    creatingPrediction={creatingPrediction}
                    onCreatePrediction={onCreatePrediction}

                    isPredictionOpen={openPredictionIds.has(diagnosis.id)}
                    onTogglePrediction={() => togglePrediction(diagnosis.id)}
                />
            ))}
        </div>
    );
}
