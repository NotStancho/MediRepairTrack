// components/claims/tabs/ClaimDiagnosisTab/DiagnosisList.tsx

import type { Diagnosis } from '../../../../types/diagnosis/diagnosis';
import DiagnosisCard from './DiagnosisCard';

interface Props {
    diagnoses: Diagnosis[];
    selectedDiagnosisId: number | null;
    onSelect: (id: number) => void;
    onEdit: (diagnosis: Diagnosis) => void;
}

export default function DiagnosisList({
                                          diagnoses,
                                          selectedDiagnosisId,
                                          onSelect,
                                          onEdit
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
            {diagnoses.map(diagnosis => (
                <DiagnosisCard
                    key={diagnosis.id}
                    diagnosis={diagnosis}
                    selected={diagnosis.id === selectedDiagnosisId}
                    onClick={() => onSelect(diagnosis.id)}
                    onEdit={() => onEdit(diagnosis)}
                />
            ))}
        </div>
    );
}