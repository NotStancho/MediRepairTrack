//src/pages/ClaimListPage.tsx
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';
import { getAllClaims, getClaimsByClient } from '../../api/claim';
import { getAssignedActiveClaims } from '../../api/claimEmployee';

import type { Claim } from '../../types/claim/claim';
import type { AssignedActiveClaim } from '../../types/claim/assignedClaim';

import { REPAIR_TYPE_LABELS } from '../../utils/claimLabels';

import Button from '../../ui/Button';
import { Table, TableToolbar, type TableColumnDef } from '../../ui/Table';

import { formatDateTime } from '../../utils/formats/dateFormat';
import ClaimStatusBadge from '../../components/badges/ClaimStatusBadge';
import RoleInClaimBadge from '../../components/badges/RoleInClaimBadge';

export default function ClaimListPage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [claims, setClaims] = useState<Claim[]>([]);
    const [assignedClaims, setAssignedClaims] = useState<AssignedActiveClaim[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        let cancelled = false;

        const load = async () => {
            try {
                setLoading(true);

                if (user.role === 'CLIENT') {
                    const data = await getClaimsByClient(user.clientId!);
                    if (!cancelled) setClaims(data);

                } else if (user.role === 'EMPLOYEE' && user.position === 'SERVICE_ENGINEER') {
                    const data = await getAssignedActiveClaims(user.employeeId!);
                    if (!cancelled) setAssignedClaims(data);

                } else {
                    const data = await getAllClaims();
                    if (!cancelled) setClaims(data);
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        void load();

        return () => {
            cancelled = true;
        };
    }, [user]);


    const openClaim = useCallback((id: number) => {
        if (user?.role === 'CLIENT') navigate(`/client/claims/${id}`);
        else if (user?.role === 'EMPLOYEE') navigate(`/employee/claims/${id}`);
        else navigate(`/claims/${id}`);
    }, [navigate, user?.role]);

    const claimColumns = useMemo<TableColumnDef<Claim>[]>(() => [
        {
            accessorKey: 'id',
            header: '№',
            meta: { label: 'Номер' },
            cell: ({ row }) => <span className="font-semibold">{row.original.id}</span>,
        },
        {
            accessorKey: 'repairType',
            header: 'Тип ремонту',
            meta: { label: 'Тип' },
            cell: ({ row }) => REPAIR_TYPE_LABELS[row.original.repairType],
        },
        {
            accessorKey: 'status',
            header: 'Статус',
            meta: { align: 'center' },
            cell: ({ row }) => <ClaimStatusBadge status={row.original.status} shape="rounded" />,
        },
        {
            accessorKey: 'defectDescription',
            header: 'Опис дефекту',
            meta: { label: 'Опис', headerClassName: 'min-w-[180px]' },
            cell: ({ row }) => (
                <span className="line-clamp-1 text-ink">
                    {row.original.defectDescription}
                </span>
            ),
        },
        {
            accessorKey: 'createdAt',
            header: 'Створено',
            meta: { align: 'center' },
            cell: ({ row }) => formatDateTime(row.original.createdAt),
        },
        {
            accessorKey: 'closedAt',
            header: 'Закрито',
            meta: { align: 'center' },
            cell: ({ row }) => row.original.closedAt ? formatDateTime(row.original.closedAt) : '—',
        },
        {
            id: 'actions',
            header: 'Дії',
            meta: { align: 'center', headerClassName: 'w-24' },
            enableSorting: false,
            enableGlobalFilter: false,
            cell: ({ row }) => (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        openClaim(row.original.id);
                    }}
                    className="text-brand hover:underline text-sm"
                >
                    Деталі →
                </button>
            ),
        },
    ], [openClaim]);

    const assignedColumns = useMemo<TableColumnDef<AssignedActiveClaim>[]>(() => [
        {
            accessorKey: 'claimId',
            header: '№',
            meta: { label: 'Номер', headerClassName: 'w-16' },
            cell: ({ row }) => <span className="font-semibold">{row.original.claimId}</span>,
        },
        {
            accessorKey: 'repairType',
            header: 'Тип',
            cell: ({ row }) => REPAIR_TYPE_LABELS[row.original.repairType],
        },
        {
            accessorKey: 'status',
            header: 'Статус',
            meta: { align: 'center' },
            cell: ({ row }) => <ClaimStatusBadge status={row.original.status} shape="rounded" />,
        },
        {
            accessorKey: 'role',
            header: 'Моя роль',
            meta: { align: 'center' },
            cell: ({ row }) => <RoleInClaimBadge role={row.original.role} />,
        },
        {
            accessorKey: 'hoursWorked',
            header: 'Мої години',
            meta: { align: 'center' },
        },
        {
            accessorKey: 'totalTimeSpent',
            header: 'Всього годин',
            meta: { align: 'center' },
        },
        {
            accessorKey: 'createdAt',
            header: 'Створено',
            meta: { align: 'center' },
            cell: ({ row }) => formatDateTime(row.original.createdAt),
        },
        {
            accessorKey: 'closedAt',
            header: 'Закрито',
            meta: { align: 'center' },
            cell: ({ row }) => row.original.closedAt ? formatDateTime(row.original.closedAt) : '—',
        },
        {
            accessorKey: 'defectDescription',
            header: 'Дефект',
            meta: { headerClassName: 'min-w-[180px]' },
            cell: ({ row }) => (
                <span className="line-clamp-1 text-ink">
                    {row.original.defectDescription}
                </span>
            ),
        },
        {
            id: 'actions',
            header: 'Дії',
            meta: { align: 'center', headerClassName: 'w-24' },
            enableSorting: false,
            enableGlobalFilter: false,
            cell: ({ row }) => (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/employee/claims/${row.original.claimId}`);
                    }}
                    className="text-brand hover:underline text-sm"
                >
                    Деталі →
                </button>
            ),
        },
    ], [navigate]);

    if (loading && (!claims.length && !assignedClaims.length)) {
        return (
            <div className="p-4">
                <div className="text-sm text-ink-muted">Завантаження заявок…</div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="space-y-4">
            {user.role === 'EMPLOYEE' && user.position === 'SERVICE_ENGINEER' ? (
                <Table
                    data={assignedClaims}
                    columns={assignedColumns}
                    loading={loading}
                    density="compact"
                    storageKey="claim-list-table"
                    onRowClick={(row) => navigate(`/employee/claims/${row.original.claimId}`)}
                    renderToolbar={(table) => (
                        <TableToolbar
                            table={table}
                            globalFilterPlaceholder="Пошук за номером, статусом чи описом"
                            rightSlot={
                                <>
                                    {user.role === 'CLIENT' ? (
                                        <Button
                                            variant="primary"
                                            onClick={() => navigate('/client/claims/new')}
                                        >
                                            + Подати заявку
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="primary"
                                            onClick={() => navigate('/employee/claims/new')}
                                        >
                                            + Створити заявку
                                        </Button>
                                    )}
                                </>
                            }
                        />
                    )}
                    initialState={{
                        sorting: [{ id: 'createdAt', desc: true }],
                    }}
                />
            ) : (
                <Table
                    data={claims}
                    columns={claimColumns}
                    loading={loading}
                    density="compact"
                    storageKey="assigned-claims-table"
                    onRowClick={(row) => openClaim(row.original.id)}
                    renderToolbar={(table) => (
                        <TableToolbar
                            table={table}
                            globalFilterPlaceholder="Пошук за номером або описом"
                            rightSlot={
                                user.role === 'CLIENT' ? (
                                    <Button
                                        variant="primary"
                                        onClick={() => navigate('/client/claims/new')}
                                    >
                                        + Подати заявку
                                    </Button>
                                ) : (
                                    <Button
                                        variant="primary"
                                        onClick={() => navigate('/employee/claims/new')}
                                    >
                                        + Створити заявку
                                    </Button>
                                )
                            }
                        />
                    )}
                    initialState={{
                        sorting: [{ id: 'createdAt', desc: true }],
                    }}
                />
            )}
        </div>
    );
}
