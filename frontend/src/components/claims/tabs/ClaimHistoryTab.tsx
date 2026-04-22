import { useEffect, useState } from 'react';
import type { ClaimHistory } from '../../../types/claim/claimHistory';
import type { Employee } from '../../../types/employee/employee';

import { getClaimHistory } from '../../../api/claimHistory';
import { getEmployeeById } from '../../../api/employee';

import { FiClock } from 'react-icons/fi';
import { formatDateTime } from '../../../utils/formats/dateFormat';
import { HISTORY_ICONS } from '../../../utils/claimHistoryLabels';
import { EMPLOYEE_POSITION_LABELS, EMPLOYEE_POSITION_COLORS } from '../../../utils/employeeLabels';
import { CLAIM_STATUS_LABELS, STATUS_COLORS } from '../../../utils/claimLabels';

interface Props {
    claimId: number;
}

const STATUS_TRANSITION_REGEX = /([A-Z_]+)\s*→\s*([A-Z_]+)/;

export default function ClaimHistoryTab({ claimId }: Props) {
    const [items, setItems] = useState<ClaimHistory[]>([]);
    const [employees, setEmployees] = useState<Record<number, Employee>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            setLoading(true);

            const history = await getClaimHistory(claimId);

            const sorted = [...history].sort(
                (a, b) =>
                    new Date(b.actionDate).getTime() -
                    new Date(a.actionDate).getTime()
            );

            if (cancelled) return;

            setItems(sorted);

            const ids = Array.from(
                new Set(sorted.map(h => h.employeeId).filter(Boolean))
            );

            const missing = ids.filter(id => !employees[id]);
            if (missing.length) {
                const results = await Promise.all(
                    missing.map(id => getEmployeeById(id))
                );

                if (!cancelled) {
                    setEmployees(prev => {
                        const copy = { ...prev };
                        results.forEach(emp => (copy[emp.id] = emp));
                        return copy;
                    });
                }
            }

            setLoading(false);
        };

        void load();

        return () => {
            cancelled = true;
        };
    }, [claimId, employees]);

    if (loading) return <div>Завантаження історії…</div>;
    if (!items.length) return <div className="text-sm text-ink-muted">Історія порожня</div>;

    function parseStatusTransition(text: string): {
        from: keyof typeof CLAIM_STATUS_LABELS;
        to: keyof typeof CLAIM_STATUS_LABELS;
    } | null {
        const match = text.match(STATUS_TRANSITION_REGEX);

        if (!match) return null;

        return {
            from: match[1] as keyof typeof CLAIM_STATUS_LABELS,
            to: match[2] as keyof typeof CLAIM_STATUS_LABELS,
        };
    }

    return (
        <div className="relative pl-8 space-y-6">
            <div className="absolute left-3 top-0 bottom-0 w-px bg-border" />

            {items.map(item => {
                const employee = employees[item.employeeId];
                const meta = HISTORY_ICONS[item.actionType];

                const statusTransition =
                    item.actionType === 'STATUS_CHANGE'
                        ? parseStatusTransition(item.description)
                        : null;

                return (
                    <div key={item.id} className="relative flex gap-4">
                        <div className={`absolute left-0 top-1 flex items-center justify-center w-6 h-6 rounded-full text-white text-xs ${meta.color}`}>
                            {meta.icon}
                        </div>

                        <div className="ml-4 flex-1 rounded-lg bg-surface border border-border p-3 shadow-sm">
                            <div className="text-xs text-ink-muted">
                                {formatDateTime(item.actionDate)}
                            </div>

                            <div className="font-medium text-sm">
                                {meta.label}
                            </div>

                            {employee && (
                                <div className="text-xs text-ink-muted">
                                    {employee.userLastName} {employee.userFirstName}
                                    {' • '}
                                    <span
                                        className={`
                                            inline-flex items-center
                                            px-2 py-0.5
                                            rounded-full
                                            text-xs font-medium
                                            ${EMPLOYEE_POSITION_COLORS[employee.position]}
                                        `}
                                                                        >
                                        {EMPLOYEE_POSITION_LABELS[employee.position]}
                                    </span>
                                </div>
                            )}

                            {statusTransition && (
                                <div className="text-sm mt-1 text-ink-muted">
                                    Статус заявки змінено:{' '}
                                    <span
                                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mx-1
                                            ${STATUS_COLORS[statusTransition.from]}`}
                                                                >
                                        {CLAIM_STATUS_LABELS[statusTransition.from]}
                                    </span>
                                    →
                                    <span
                                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ml-1
                                            ${STATUS_COLORS[statusTransition.to]}`}
                                                                >
                                        {CLAIM_STATUS_LABELS[statusTransition.to]}
                                    </span>
                                </div>
                            )}

                            {!statusTransition && item.description && (
                                <div className="text-sm text-ink whitespace-pre-line mt-1">
                                    {item.description}
                                </div>
                            )}

                            {item.timeSpent > 0 && (
                                <div className="text-xs text-ink-muted mt-1 flex items-center gap-1">
                                    <FiClock className="w-3.5 h-3.5" />
                                    {item.timeSpent} год
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}