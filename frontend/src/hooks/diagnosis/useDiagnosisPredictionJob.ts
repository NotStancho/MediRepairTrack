import { useEffect, useState } from 'react';

import {
    buildPredictionJobEventsUrl,
    getPredictionJobByDiagnosis
} from '../../api/diagnosis/dss/diagnosisPredictionJob';
import type {
    DiagnosisPredictionJob,
    DiagnosisPredictionJobStatus
} from '../../types/diagnosis/DSS/diagnosisPredictionJob';

const activeStatuses: DiagnosisPredictionJobStatus[] = ['PENDING', 'RUNNING'];

const isActiveStatus = (status: DiagnosisPredictionJobStatus) =>
    activeStatuses.includes(status);

export function useDiagnosisPredictionJob(diagnosisId: number) {
    const [job, setJob] = useState<DiagnosisPredictionJob | null>(null);
    const [loading, setLoading] = useState(true);
    const [connected, setConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!diagnosisId) {
            setJob(null);
            setLoading(false);
            setConnected(false);
            return;
        }

        let cancelled = false;
        let source: EventSource | null = null;

        const closeSource = (updateConnection = true) => {
            if (source) {
                source.close();
                source = null;
            }
            if (updateConnection && !cancelled) {
                setConnected(false);
            }
        };

        const applyJob = (next: DiagnosisPredictionJob) => {
            if (cancelled) return;

            setJob(next);

            if (!isActiveStatus(next.status)) {
                closeSource();
            }
        };

        const connect = () => {
            if (source) {
                return;
            }

            source = new EventSource(buildPredictionJobEventsUrl(diagnosisId));

            source.onopen = () => {
                if (!cancelled) {
                    setConnected(true);
                }
            };

            source.addEventListener('prediction-job', (event) => {
                try {
                    applyJob(JSON.parse((event as MessageEvent).data) as DiagnosisPredictionJob);
                } catch {
                    if (!cancelled) {
                        setError('Отримано некоректне повідомлення про стан автоматичного прогнозу');
                    }
                }
            });

            source.onerror = () => {
                if (!cancelled) {
                    setConnected(false);
                }
            };
        };

        const load = async () => {
            setLoading(true);
            setError(null);

            try {
                const currentJob = await getPredictionJobByDiagnosis(diagnosisId);

                if (cancelled) return;

                setJob(currentJob);

                if (currentJob && isActiveStatus(currentJob.status)) {
                    connect();
                }
            } catch (ex) {
                if (!cancelled) {
                    setError(ex instanceof Error ? ex.message : 'Не вдалося отримати стан автоматичного прогнозу');
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        void load();

        return () => {
            cancelled = true;
            closeSource(false);
        };
    }, [diagnosisId]);

    return {
        job,
        loading,
        connected,
        error,
        isActive: job ? isActiveStatus(job.status) : false
    };
}
