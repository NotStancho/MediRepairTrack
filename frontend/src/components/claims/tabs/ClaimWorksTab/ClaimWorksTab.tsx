// components/tabs/ClaimWorksTab/ClaimWorksTab

import { useCallback, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

import { useAuth } from '../../../../context/AuthContext';
import { useClaimEmployees } from '../../../../hooks/useClaimEmployees';
import { useClaimPartsByClaim } from '../../../../hooks/useClaimWorkParts';
import { useClaimWorks } from '../../../../hooks/useClaimWorks';
import { useRepairWorks } from '../../../../hooks/useRepairWorks';

import type { ClaimEmployee } from '../../../../types/claimEmployee';
import type { ClaimWork } from '../../../../types/claim/claimWork';
import type { ClaimWorkPart } from '../../../../types/claim/claimWorkPart';

import Button from '../../../../ui/Button';
import ConfirmBox from '../../../../ui/ConfirmBox';
import RowActionsMenu, { type RowAction } from '../../../../ui/RowActionsMenu';
import { Table, TableToolbar, type TableColumnDef } from '../../../../ui/Table';

import CreateClaimWorkModal from './modals/CreateClaimWorkModal';
import EditClaimWorkModal from './modals/EditClaimWorkModal';
import ClaimWorkPartsModal from './modals/ClaimWorkPartsModal';

import { formatDateTime } from '../../../../utils/formats/dateFormat';
import { formatHours } from '../../../../utils/formats/hourFormat';
import {
    EMPLOYEE_POSITION_LABELS,
} from '../../../../utils/employeeLabels';
import {
    ROLE_IN_CLAIM_COLORS,
    ROLE_IN_CLAIM_LABELS,
} from '../../../../utils/roleInClaimLabels';

interface Props {
    claimId: number;
    onWorksChanged?: () => Promise<void> | void;
}

function getEmployeeDisplayName(employee?: ClaimEmployee) {
    return employee
        ? `${employee.lastName} ${employee.firstName}`
        : null;
}

function formatQty(value: number) {
    return Number.isInteger(value)
        ? String(value)
        : value.toFixed(3).replace(/\.?0+$/, '');
}

function buildPartsPreview(parts: ClaimWorkPart[]) {
    if (!parts.length) {
        return 'Немає використаних запчастин';
    }

    const visible = parts.slice(0, 2).map(part =>
        `${formatQty(part.quantity)} ${part.unitName} ${part.partName}`,
    );

    const hiddenCount = parts.length - visible.length;

    return hiddenCount > 0
        ? `${visible.join(', ')} +${hiddenCount}`
        : visible.join(', ');
}

export default function ClaimWorksTab({
    claimId,
    onWorksChanged,
}: Props) {
    const { user } = useAuth();

    const {
        data: items,
        loading,
        creating,
        updatingId,
        deletingId,
        create,
        update,
        updateNote,
        remove,
    } = useClaimWorks(claimId);

    const {
        data: claimEmployees,
        loading: claimEmployeesLoading,
    } = useClaimEmployees(claimId);

    const {
        data: claimParts,
        loading: claimPartsLoading,
        refresh: refreshClaimParts,
    } = useClaimPartsByClaim(claimId);

    const {
        data: RepairWorks,
        loading: RepairWorksLoading,
    } = useRepairWorks();

    const [createOpen, setCreateOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<ClaimWork | null>(null);
    const [editingNoteOnly, setEditingNoteOnly] = useState(false);
    const [deleteItem, setDeleteItem] = useState<ClaimWork | null>(null);
    const [partsItem, setPartsItem] = useState<ClaimWork | null>(null);

    const performedByEmployeeId = user?.employeeId ?? null;
    const isManager = user?.role === 'EMPLOYEE' && user.position === 'MANAGER';

    const employeeById = useMemo(
        () => new Map(claimEmployees.map(employee => [employee.employeeId, employee])),
        [claimEmployees],
    );
    const repairWorkById = useMemo(
        () => new Map(RepairWorks.map(repairWork => [repairWork.id, repairWork])),
        [RepairWorks],
    );
    const partsByClaimWorkId = useMemo(() => {
        const grouped = new Map<number, ClaimWorkPart[]>();

        for (const part of claimParts) {
            const group = grouped.get(part.claimWorkId) ?? [];
            group.push(part);
            grouped.set(part.claimWorkId, group);
        }

        return grouped;
    }, [claimParts]);

    const currentClaimEmployee = performedByEmployeeId != null
        ? employeeById.get(performedByEmployeeId)
        : undefined;
    const isAssignedEmployee = !!currentClaimEmployee;
    const isLeadOnClaim = currentClaimEmployee?.roleInClaim === 'LEAD';
    const canActOnWork =
        user?.role === 'EMPLOYEE' &&
        performedByEmployeeId != null &&
        !isManager &&
        isAssignedEmployee;
    const canCreateOwnWork = canActOnWork;
    const showActionsColumn = canActOnWork;

    const syncClaimSummary = async () => {
        await onWorksChanged?.();
    };

    const openEdit = useCallback((item: ClaimWork, noteOnly: boolean) => {
        setEditingItem(item);
        setEditingNoteOnly(noteOnly);
    }, []);

    const closeEdit = useCallback(() => {
        setEditingItem(null);
        setEditingNoteOnly(false);
    }, []);

    const getRowActions = useCallback((item: ClaimWork) => {
        const isOwnRecord = performedByEmployeeId != null && item.employeeId === performedByEmployeeId;
        const actions: RowAction[] = [];

        if (canActOnWork && isOwnRecord) {
            actions.push({
                label: 'Запчастини',
                onClick: () => setPartsItem(item),
            });
        }

        if (canActOnWork && isOwnRecord) {
            actions.push({
                label: 'Редагувати',
                onClick: () => openEdit(item, false),
            });
        } else if (canActOnWork && isLeadOnClaim) {
            actions.push({
                label: 'Редагувати примітку',
                onClick: () => openEdit(item, true),
            });
        }

        if (canActOnWork && isOwnRecord) {
            actions.push({
                label: 'Видалити',
                onClick: () => setDeleteItem(item),
                danger: true,
            });
        }

        return actions;
    }, [
        canActOnWork,
        isLeadOnClaim,
        openEdit,
        performedByEmployeeId
    ]);

    const columns = useMemo<TableColumnDef<ClaimWork>[]>(() => {
        const baseColumns: TableColumnDef<ClaimWork>[] = [
            {
                id: 'work',
                header: 'Робота',
                accessorFn: row => {
                    const repairWork = repairWorkById.get(row.repairWorkId);

                    return [
                        repairWork?.name ?? `Робота #${row.repairWorkId}`,
                        repairWork?.description ?? '',
                    ].join(' ');
                },
                cell: ({ row }) => {
                    const repairWork = repairWorkById.get(row.original.repairWorkId);
                    const note = row.original.note?.trim() ?? '';
                    const notePreview = note.length > 100
                        ? note.slice(0, 100) + '…'
                        : note;

                    return (
                        <div className="min-w-0 space-y-1">
                            <div className="font-medium text-ink">
                                {repairWork?.name ?? `Робота #${row.original.repairWorkId}`}
                            </div>

                            {note && (
                                <div
                                    className="line-clamp-2 whitespace-pre-line wrap-break-word text-xs text-ink-muted"
                                    title={note}
                                >
                                    Примітка: {notePreview}
                                </div>
                            )}
                        </div>
                    );
                },
            },
            {
                id: 'parts',
                header: 'Запчастини',
                accessorFn: row => buildPartsPreview(partsByClaimWorkId.get(row.id) ?? []),
                cell: ({ row }) => {
                    const parts = partsByClaimWorkId.get(row.original.id) ?? [];

                    if (!parts.length) {
                        return (
                            <span className="text-xs text-ink-muted">
                                Немає використаних запчастин
                            </span>
                        );
                    }

                    return (
                        <div className="min-w-0 space-y-1 text-xs">
                            {parts.slice(0, 2).map(part => (
                                <div key={part.partId} className="truncate text-ink">
                                    <span className="font-mono">
                                        {formatQty(part.quantity)} {part.unitName}
                                    </span>{' '}
                                    {part.partName}
                                </div>
                            ))}

                            {parts.length > 2 && (
                                <div className="text-ink-muted">
                                    Ще {parts.length - 2}
                                </div>
                            )}
                        </div>
                    );
                },
            },
            {
                id: 'employee',
                header: 'Виконавець',
                accessorFn: row => {
                    const employee = employeeById.get(row.employeeId);

                    return [
                        getEmployeeDisplayName(employee) ?? `Працівник #${row.employeeId}`,
                        employee ? EMPLOYEE_POSITION_LABELS[employee.position] : '',
                        employee ? ROLE_IN_CLAIM_LABELS[employee.roleInClaim] : '',
                    ].join(' ');
                },
                cell: ({ row }) => {
                    const employee = employeeById.get(row.original.employeeId);

                    if (!employee) {
                        return (
                            <div className="min-w-0">
                                <div className="font-medium text-ink">
                                    Працівник #{row.original.employeeId}
                                </div>
                                <div className="text-xs text-ink-muted">
                                    Немає у поточному списку працівників заявки
                                </div>
                            </div>
                        );
                    }

                    return (
                        <div className="min-w-0">
                            <div className="font-medium text-ink">
                                {employee.lastName} {employee.firstName}
                            </div>
                            <div className="mt-1 flex flex-wrap gap-1 text-xs">
                                <span
                                    className={`inline-flex rounded-full px-2 py-0.5 ${ROLE_IN_CLAIM_COLORS[employee.roleInClaim]}`}
                                >
                                    {ROLE_IN_CLAIM_LABELS[employee.roleInClaim]}
                                </span>
                            </div>
                        </div>
                    );
                },
            },
            {
                id: 'timeSpent',
                header: 'Час',
                accessorFn: row => row.timeSpent,
                meta: { align: 'right' },
                cell: ({ row }) => (
                    <span className="font-mono font-medium">
                        {formatHours(row.original.timeSpent, '0 год')}
                    </span>
                ),
            },
            {
                id: 'date',
                header: 'Дата',
                accessorFn: row => row.createdAt,
                cell: ({ row }) => (
                    <div className="space-y-1 text-xs text-ink-muted">
                        <div>
                            Додано:{' '}
                            <span className="text-ink">
                                {formatDateTime(row.original.createdAt)}
                            </span>
                        </div>

                        {row.original.updatedAt && (
                            <div>
                                Оновлено:{' '}
                                <span className="text-ink">
                                    {formatDateTime(row.original.updatedAt)}
                                </span>
                            </div>
                        )}
                    </div>
                ),
            },
        ];

        if (!showActionsColumn) {
            return baseColumns;
        }

        return [
            ...baseColumns,
            {
                id: 'actions',
                header: 'Дії',
                enableSorting: false,
                enableGlobalFilter: false,
                meta: { align: 'center', headerClassName: 'w-20' },
                cell: ({ row }) => {
                    const actions = getRowActions(row.original);

                    if (!actions.length) {
                        return null;
                    }

                    return (
                        <RowActionsMenu
                            disabled={
                                deletingId === row.original.id ||
                                updatingId === row.original.id
                            }
                            actions={actions}
                            trigger={(
                                <span className="rounded px-2 py-1 hover:bg-surface-muted">
                                    ⋯
                                </span>
                            )}
                        />
                    );
                },
            },
        ];
    }, [
        deletingId,
        employeeById,
        getRowActions,
        partsByClaimWorkId,
        repairWorkById,
        showActionsColumn,
        updatingId,
    ]);

    const deleteRepairWorkName = deleteItem
        ? repairWorkById.get(deleteItem.repairWorkId)?.name ?? `Робота #${deleteItem.repairWorkId}`
        : null;

    return (
        <>
            <Table
                data={items}
                columns={columns}
                loading={loading || claimEmployeesLoading || RepairWorksLoading || claimPartsLoading}
                density="compact"
                storageKey={`claim-works-tab-${claimId}`}
                showPagination={false}
                renderToolbar={table => (
                    <TableToolbar
                        table={table}
                        globalFilterPlaceholder="Пошук за роботою, запчастиною, виконавцем або приміткою"
                        rightSlot={canCreateOwnWork && currentClaimEmployee ? (
                            <Button
                                variant="primary"
                                onClick={() => setCreateOpen(true)}
                            >
                                + Додати роботу
                            </Button>
                        ) : undefined}
                    />
                )}
                renderEmptyState={
                    <div className="text-sm text-ink-muted">
                        Ремонтні роботи ще не зафіксовані
                    </div>
                }
            />

            {createOpen && currentClaimEmployee && performedByEmployeeId && (
                <CreateClaimWorkModal
                    claimId={claimId}
                    currentEmployee={currentClaimEmployee}
                    repairWorks={RepairWorks}
                    repairWorksLoading={RepairWorksLoading}
                    creating={creating}
                    onClose={() => setCreateOpen(false)}
                    onCreate={async payload => {
                        await create(payload, performedByEmployeeId);
                        await syncClaimSummary();
                        toast.success('Ремонтну роботу додано');
                    }}
                />
            )}

            {editingItem && performedByEmployeeId && (
                <EditClaimWorkModal
                    claimWork={editingItem}
                    repairWorks={RepairWorks}
                    repairWorksLoading={RepairWorksLoading}
                    updating={updatingId === editingItem.id}
                    noteOnly={editingNoteOnly}
                    onClose={closeEdit}
                    onSave={async payload => {
                        const normalizeNote = (value?: string | null) => value?.trim() || null;

                        const repairWorkChanged = payload.repairWorkId !== editingItem.repairWorkId;
                        const timeChanged = Number(payload.timeSpent) !== Number(editingItem.timeSpent);
                        const noteChanged =
                            normalizeNote(payload.note) !== normalizeNote(editingItem.note);

                        const isNoteOnlyUpdate =
                            editingNoteOnly || (!repairWorkChanged && !timeChanged && noteChanged);

                        if (!repairWorkChanged && !timeChanged && !noteChanged) {
                            // нічого не змінилось
                            closeEdit();
                            return;
                        }

                        if (isNoteOnlyUpdate) {
                            await updateNote(
                                editingItem.id,
                                { note: normalizeNote(payload.note) },
                                performedByEmployeeId
                            );
                        } else {
                            await update(editingItem.id, payload, performedByEmployeeId);
                        }

                        await syncClaimSummary();

                        toast.success(
                            isNoteOnlyUpdate
                                ? 'Примітку оновлено'
                                : 'Ремонтну роботу оновлено'
                        );
                    }}
                />
            )}

            {deleteItem && performedByEmployeeId && (
                <ConfirmBox
                    title="Видалити ремонтну роботу?"
                    description={deleteRepairWorkName ?? 'Обраний запис буде видалено'}
                    confirmText="Видалити"
                    confirmVariant="danger"
                    onConfirm={async () => {
                        await remove(deleteItem.id, performedByEmployeeId);
                        await refreshClaimParts();
                        toast.success('Ремонтну роботу видалено');
                        setDeleteItem(null);
                    }}
                    onCancel={() => setDeleteItem(null)}
                />
            )}

            {partsItem && (
                <ClaimWorkPartsModal
                    claimWork={partsItem}
                    repairWorkName={
                        repairWorkById.get(partsItem.repairWorkId)?.name ??
                        `Робота #${partsItem.repairWorkId}`
                    }
                    canManage={
                        canActOnWork &&
                        performedByEmployeeId != null &&
                        partsItem.employeeId === performedByEmployeeId
                    }
                    employeeId={performedByEmployeeId}
                    onClose={() => setPartsItem(null)}
                    onChanged={async () => {
                        await refreshClaimParts();
                    }}
                />
            )}
        </>
    );
}
