// pages/claims/tabs/ClaimHistoryTab

import { useClaimHistory } from '../../../hooks/useClaimHistory';

import { formatDateTime } from '../../../utils/formats/dateFormat';
import { HISTORY_ICONS } from '../../../utils/claimHistoryLabels';
import EmployeePositionBadge from '../../../components/badges/EmployeePositionBadge';
import ClaimHistoryDescription from './ClaimHistoryDescription';

interface Props {
    claimId: number;
}

export default function ClaimHistoryTab({ claimId }: Props) {
    const { data: items, loading } = useClaimHistory(claimId);

    if (loading) return <div>Завантаження історії…</div>;
    if (!items.length) return <div className="text-sm text-ink-muted">Історія порожня</div>;

    return (
        <div className="relative pl-8 space-y-6">
            <div className="absolute left-3 top-0 bottom-0 w-px bg-border" />

            {items.map(item => {
                const employee = item.employee;
                const meta = HISTORY_ICONS[item.actionType];
                const showEmployee = item.actionType !== 'SYSTEM_EVENT' && employee;

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

                            {showEmployee && (
                                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-ink-muted">
                                    <span>{employee.lastName} {employee.firstName}</span>
                                    <EmployeePositionBadge position={employee.position} />
                                </div>
                            )}

                            <ClaimHistoryDescription item={item} />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
