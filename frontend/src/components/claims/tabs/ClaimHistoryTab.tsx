import { useEffect, useState } from 'react';
import type { ClaimHistory } from '../../../types/claim/claimHistory';
import type { Employee } from '../../../types/employee';
import { getClaimHistory } from '../../../api/claimHistory';
import { getEmployeeById } from '../../../api/employee';
import { formatDateTime } from '../../../utils/dateFormat';
import { HISTORY_ICONS } from '../../../utils/claimHistoryLabels';

interface Props {
    claimId: number;
}

export default function ClaimHistoryTab({ claimId }: Props) {
    const [items, setItems] = useState<ClaimHistory[]>([]);
    const [employees, setEmployees] = useState<Record<number, Employee>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getClaimHistory(claimId)
            .then(history => {
                const sorted = [...history].sort(
                    (a, b) =>
                        new Date(b.actionDate).getTime() -
                        new Date(a.actionDate).getTime()
                );

                setItems(sorted);
                loadEmployees(sorted);
            })
            .finally(() => setLoading(false));
    }, [claimId]);

    const loadEmployees = async (history: ClaimHistory[]) => {
        const ids = Array.from(
            new Set(history.map(h => h.employeeId).filter(Boolean))
        );

        const missing = ids.filter(id => !employees[id]);
        if (!missing.length) return;

        const results = await Promise.all(
            missing.map(id => getEmployeeById(id))
        );

        setEmployees(prev => {
            const copy = { ...prev };
            results.forEach(emp => (copy[emp.id] = emp));
            return copy;
        });
    };

    if (loading) return <div>Завантаження історії…</div>;
    if (!items.length) return <div className="text-sm text-gray-500">Історія порожня</div>;

    return (
        <div className="relative pl-8 space-y-6">
            <div className="absolute left-3 top-0 bottom-0 w-px bg-gray-200" />

            {items.map(item => {
                const employee = employees[item.employeeId];
                const meta = HISTORY_ICONS[item.actionType];

                return (
                    <div key={item.id} className="relative flex gap-4">
                        <div
                            className={`absolute left-0 top-1 flex items-center justify-center
                                        w-6 h-6 rounded-full text-white text-xs ${meta.color}`}
                        >
                            {meta.icon}
                        </div>

                        <div className="ml-4 flex-1 rounded bg-white p-3">
                            <div className="text-xs text-gray-500">
                                {formatDateTime(item.actionDate)}
                            </div>

                            <div className="font-medium text-sm">
                                {meta.label}
                            </div>

                            {employee && (
                                <div className="text-xs text-gray-600">
                                    {employee.userLastName} {employee.userFirstName}
                                    {' • '}
                                    {employee.position}
                                </div>
                            )}

                            <div className="text-sm text-gray-700 whitespace-pre-line mt-1">
                                {item.description}
                            </div>

                            {item.timeSpent > 0 && (
                                <div className="text-xs text-gray-500 mt-1">
                                    ⏱ {item.timeSpent} год
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}