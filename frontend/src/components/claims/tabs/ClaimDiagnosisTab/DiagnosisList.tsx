// components/claims/tabs/ClaimDiagnosisTab/DiagnosisList.tsx

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

    onConfirm: (diagnosis: Diagnosis) => Promise<void>;
    onReject: (diagnosis: Diagnosis) => Promise<void>;
    onArchive: (diagnosis: Diagnosis) => Promise<void>;
}

export default function DiagnosisList({
                                          diagnoses,
                                          selectedDiagnosisId,

                                          onSelect,
                                          onEdit,

                                          allowedStatuses, allowedStatusesLoading,

                                          confirmingId, rejectingId, archivingId,
                                          onConfirm, onReject, onArchive,
                                      }: Props) {
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

                    onConfirm={() => onConfirm(diagnosis)}
                    onReject={() => onReject(diagnosis)}
                    onArchive={() => onArchive(diagnosis)}
                />
            ))}
        </div>
    );
}