import type { ReactNode } from 'react';

interface Props {
    label: string;
    value: ReactNode;
    helper?: ReactNode;
}

export default function MetricCard({ label, value, helper }: Props) {
    return (
        <div className="rounded-xl border border-border bg-surface-muted p-4">
            <div className="text-xs font-medium uppercase tracking-wide text-ink-muted">
                {label}
            </div>

            <div className="mt-2 font-mono text-base font-semibold text-ink">
                {value}
            </div>

            {helper && (
                <div className="mt-1 text-xs text-ink-muted">
                    {helper}
                </div>
            )}
        </div>
    );
}
