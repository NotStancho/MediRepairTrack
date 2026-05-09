// pages/claims/tabs/ClaimEmployeesTab.tsx

import { useEffect, useMemo, useState } from 'react';
import { getClaimEmployees } from '../../../api/claimEmployee';
import type { ClaimEmployee } from '../../../types/claimEmployee';
import { ROLE_IN_CLAIM_LABELS } from "../../../utils/roleInClaimLabels";
import { EMPLOYEE_POSITION_LABELS } from "../../../utils/employeeLabels";
import { Table, TableToolbar, type TableColumnDef } from '../../../ui/Table';
import EmployeePositionBadge from '../../../components/badges/EmployeePositionBadge';
import RoleInClaimBadge from '../../../components/badges/RoleInClaimBadge';

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
            cell: ({ row }) => <EmployeePositionBadge position={row.original.position} />,
        },
        {
            id: 'roleInClaim',
            header: 'Роль у заявці',
            accessorFn: row => ROLE_IN_CLAIM_LABELS[row.roleInClaim],
            meta: { align: 'center' },
            cell: ({ row }) => <RoleInClaimBadge role={row.original.roleInClaim} />,
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
