// types/diagnosis/DSS/diagnosisPredictionJob.ts

export type DiagnosisPredictionJobStatus =
    | 'PENDING'
    | 'RUNNING'
    | 'COMPLETED'
    | 'FAILED';

export interface DiagnosisPredictionJob {
    diagnosisId: number;
    status: DiagnosisPredictionJobStatus;
    progress: number;
    currentStage: string;
    message: string;
    errorMessage: string | null;
    startedAt: string;
    finishedAt: string | null;
}
