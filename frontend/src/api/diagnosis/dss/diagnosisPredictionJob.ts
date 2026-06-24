import { API_BASE_URL } from '../../api';
import type { DiagnosisPredictionJob } from '../../../types/diagnosis/DSS/diagnosisPredictionJob';

const predictionJobPath = (diagnosisId: number) =>
    `/api/prediction-jobs/diagnosis/${diagnosisId}`;

export const getPredictionJobByDiagnosis = async (
    diagnosisId: number
): Promise<DiagnosisPredictionJob | null> => {
    const res = await fetch(`${API_BASE_URL}${predictionJobPath(diagnosisId)}`);

    if (res.status === 204 || res.status === 404) {
        return null;
    }

    if (!res.ok) {
        throw new Error('Не вдалося отримати стан автоматичного прогнозу');
    }

    return await res.json() as DiagnosisPredictionJob;
};

export const buildPredictionJobEventsUrl = (diagnosisId: number): string =>
    `${API_BASE_URL}${predictionJobPath(diagnosisId)}/events`;
