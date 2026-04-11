// components/claims/tabs/ClaimDiagnosisTab/DiagnosisList.tsx

import { useState } from 'react';
import type { Diagnosis, DiagnosisStatus } from '../../../../types/diagnosis/diagnosis';
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
}

export default function DiagnosisList({
                                          diagnoses,
                                          selectedDiagnosisId,

                                          onSelect,
                                          onEdit,

                                          allowedStatuses, allowedStatusesLoading,

                                          confirmingId, rejectingId, archivingId, deletingId,
                                          onConfirm, onReject, onArchive, onDelete
                                      }: Props) {
    const [openPredictionId, setOpenPredictionId] = useState<number | null>(null);

    const togglePrediction = (id: number) => {
        setOpenPredictionId(prev => (prev === id ? null : id));
        onSelect(id);
    };
    const handleSelect = (id: number) => {
        onSelect(id);
        setOpenPredictionId(prev => (prev === id ? prev : null));
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
                    onClick={() => handleSelect(diagnosis.id)}
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
                    onDelete={() => onDelete(diagnosis)}

                    isPredictionOpen={openPredictionId === diagnosis.id}
                    onTogglePrediction={() => togglePrediction(diagnosis.id)}
                />
            ))}
        </div>
    );
}