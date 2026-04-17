// types/diagnosis/diagnosis.ts

export type DiagnosisStatus =
    | 'DRAFT'
    | 'PREDICTED'
    | 'CONFIRMED'
    | 'REJECTED'
    | 'ARCHIVED';

export type DiagnosisType =
    | 'AUTOMATED'
    | 'MANUAL'
    | 'HYBRID';

export interface Diagnosis {
    id: number;
    claimId: number;
    engineerId: number | null;

    preliminaryConclusion: string;
    finalConclusion: string | null;

    estimatedCost: number;
    estimatedTimeHours: number;

    diagnosisType: DiagnosisType;
    status: DiagnosisStatus;

    createdAt: string;
    updatedAt: string | null;
    confirmedAt: string | null;

    hasPrediction: boolean;
}
