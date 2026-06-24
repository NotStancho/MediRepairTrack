import type { DiagnosisPredictionJob } from '../../../../types/diagnosis/DSS/diagnosisPredictionJob';
import Spinner from '../../../../ui/Spinner';

interface Props {
    job: DiagnosisPredictionJob | null;
    loading: boolean;
    connected: boolean;
    error: string | null;
}

const statusLabel: Record<DiagnosisPredictionJob['status'], string> = {
    PENDING: 'Очікує запуску',
    RUNNING: 'Виконується',
    COMPLETED: 'Готово',
    FAILED: 'Помилка'
};

export default function DiagnosisPredictionJobProgress({
                                                           job,
                                                           loading,
                                                           connected,
                                                           error,
                                                       }: Props) {
    if (loading && !job) return null;
    if (!job && !error) return null;
    if (job?.status === 'COMPLETED' && !error) return null;

    const progress = Math.max(0, Math.min(100, job?.progress ?? 0));
    const isActive = job?.status === 'PENDING' || job?.status === 'RUNNING';
    const isFailed = job?.status === 'FAILED' || !!error;

    return (
        <div
            className={`
                w-full rounded-lg border p-4 text-sm shadow-sm
                ${isFailed
                ? 'border-danger-muted bg-red-50 text-danger'
                : 'border-brand-soft bg-surface text-ink'}
            `}
        >
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div className="flex min-w-0 items-center gap-2">
                    {isActive && <Spinner size={15} />}

                    <div className="min-w-0">
                        <div className="font-semibold">
                            Автоматичний прогноз: {job ? statusLabel[job.status] : 'перевірка стану'}
                        </div>

                        <div className={isFailed ? 'text-danger' : 'text-ink-muted'}>
                            {error || job?.errorMessage || job?.message || 'Очікуємо оновлення стану прогнозу.'}
                        </div>
                    </div>
                </div>

                {isActive && (
                    <div className="text-xs text-ink-muted">
                        {connected ? 'Оновлення в реальному часі' : 'Відновлюємо зʼєднання'}
                    </div>
                )}
            </div>

            {job && (
                <div className="mt-3">
                    <div className="mb-1 flex items-center justify-between text-xs text-ink-muted">
                        <span>Прогрес</span>
                        <span>{progress}%</span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-surface-muted">
                        <div
                            className={`
                                h-full rounded-full transition-all duration-300
                                ${isFailed ? 'bg-danger' : 'bg-brand'}
                            `}
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}