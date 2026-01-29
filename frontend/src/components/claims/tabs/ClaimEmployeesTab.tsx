import { useEffect, useMemo, useState } from 'react';
import { getClaimEmployees } from '../../../api/claimEmployee';
import type { ClaimEmployee } from '../../../types/claimEmployee';
import { ROLE_IN_CLAIM_COLORS, ROLE_IN_CLAIM_LABELS } from "../../../utils/roleInClaimLabels";
import { EMPLOYEE_POSITION_COLORS, EMPLOYEE_POSITION_LABELS } from "../../../utils/employeeLabels";
import { Table, TableToolbar, type TableColumnDef } from '../../../ui/Table';

interface Props {
    claimId: number;
}

export default function ClaimEmployeesTab({claimId}: Props) {
    const [items, setItems] = useState<ClaimEmployee[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getClaimEmployees(claimId)
            .then(setItems)
            .finally(() => setLoading(false));
    }, [claimId]);

    const columns = useMemo<TableColumnDef<ClaimEmployee>[]>(() => [
        {
            id: 'employee',
            header: 'Працівник',
            accessorFn: row => `${row.lastName} ${row.firstName}`,
            cell: ({ row }) => (
                <span className="font-medium">
                {row.original.lastName} {row.original.firstName}
            </span>
            ),
        },
        {
            id: 'position',
            header: 'Посада',
            accessorFn: row => EMPLOYEE_POSITION_LABELS[row.position],
            cell: ({ row }) => (
                <span
                    className={`
                    inline-flex items-center
                    px-2 py-0.5
                    rounded-full
                    text-xs font-medium
                    ${EMPLOYEE_POSITION_COLORS[row.original.position]}
                `}
                >
                {EMPLOYEE_POSITION_LABELS[row.original.position]}
            </span>
            ),
        },
        {
            id: 'roleInClaim',
            header: 'Роль у заявці',
            accessorFn: row => ROLE_IN_CLAIM_LABELS[row.roleInClaim],
            meta: { align: 'center' },
            cell: ({ row }) => (
                <span
                    className={`
                    inline-flex items-center
                    px-2 py-0.5
                    rounded-full
                    text-xs font-medium
                    ${ROLE_IN_CLAIM_COLORS[row.original.roleInClaim]}
                `}
                >
                {ROLE_IN_CLAIM_LABELS[row.original.roleInClaim]}
            </span>
            ),
        },
        {
            id: 'hoursWorked',
            header: 'Години',
            accessorFn: row =>
                row.hoursWorked != null ? String(row.hoursWorked) : '',
            meta: { align: 'center' },
            cell: ({ row }) => row.original.hoursWorked ?? '–',
        },
        {
            id: 'notes',
            header: 'Примітки',
            accessorFn: row => row.notes ?? '',
            meta: { cellClassName: 'text-ink-muted max-w-xs truncate' },
            cell: ({ row }) =>
                row.original.notes ? (
                    <span className="whitespace-pre-line">
                    {row.original.notes}
                </span>
                ) : (
                    <span className="text-ink-soft">–</span>
                ),
        },
    ], []);

    return (
        <Table
            data={items}
            columns={columns}
            loading={loading}
            density="compact"
            storageKey="claim-employees-tab"
            showPagination={false}
            renderToolbar={(table) => (
                <TableToolbar
                    table={table}
                    globalFilterPlaceholder="Пошук за ПІБ, посадою, роллю або нотатками"
                />
            )}
            renderEmptyState={
                <div className="text-sm text-ink-muted">
                    Працівники не призначені
                </div>
            }
        />
    );
}
