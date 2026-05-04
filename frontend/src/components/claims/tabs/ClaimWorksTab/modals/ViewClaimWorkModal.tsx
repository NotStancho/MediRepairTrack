// components/claims/tabs/ClaimWorksTab/modals/ViewClaimWorkModal

import { useMemo, type ReactNode } from 'react';

import { useClaimEmployees } from '../../../../../hooks/useClaimEmployees';
import { useClaimWorkParts } from '../../../../../hooks/useClaimWorkParts';
import { useRepairWorks } from '../../../../../hooks/useRepairWorks';

import type { ClaimWork } from '../../../../../types/claim/claimWork';
import type { ClaimWorkPart } from '../../../../../types/claim/claimWorkPart';
import type { ClaimEmployee } from '../../../../../types/claimEmployee';

import Button from '../../../../../ui/Button';
import Modal from '../../../../../ui/Modal/Modal';
import ModalFooter from '../../../../../ui/Modal/ModalFooter';
import { Table, type TableColumnDef } from '../../../../../ui/Table';

import {
    EMPLOYEE_POSITION_COLORS,
    EMPLOYEE_POSITION_LABELS,
} from '../../../../../utils/employeeLabels';
import { formatDateTime } from '../../../../../utils/formats/dateFormat';
import { formatHours } from '../../../../../utils/formats/hourFormat';
import { formatMoney } from '../../../../../utils/formats/moneyFormat';
import { formatPartQuantity } from '../../../../../utils/formats/partQuantityFormat';
import {
    ROLE_IN_CLAIM_COLORS,
    ROLE_IN_CLAIM_LABELS,
} from '../../../../../utils/roleInClaimLabels';

interface Props {
    claimWork: ClaimWork;
    onClose: () => void;
}

function InfoCard({
    label,
    value,
    mono = false,
}: {
    label: string;
    value: ReactNode;
    mono?: boolean;
}) {
    return (
        <div className="rounded-xl border border-border bg-surface-muted p-4">
            <div className="text-xs font-medium uppercase tracking-wide text-ink-muted">
                {label}
            </div>
            <div className={`mt-2 text-sm text-ink ${mono ? 'font-mono' : ''}`}>
                {value}
            </div>
        </div>
    );
}

function getEmployeeDisplayName(employee?: ClaimEmployee) {
    if (!employee) {
        return null;
    }

    return `${employee.lastName} ${employee.firstName}`;
}

export default function ViewClaimWorkModal({
    claimWork,
    onClose,
}: Props) {
    const {
        data: repairWorks,
        loading: repairWorksLoading,
    } = useRepairWorks();
    const {
        data: claimEmployees,
        loading: claimEmployeesLoading,
    } = useClaimEmployees(claimWork.claimId);
    const {
        data: parts,
        loading: partsLoading,
    } = useClaimWorkParts(claimWork.id);

    const repairWork = useMemo(
        () => repairWorks.find(item => item.id === claimWork.repairWorkId),
        [claimWork.repairWorkId, repairWorks],
    );
    const employee = useMemo(
        () => claimEmployees.find(item => item.employeeId === claimWork.employeeId),
        [claimEmployees, claimWork.employeeId],
    );
    const workName = repairWorksLoading
        ? 'Завантаження роботи…'
        : repairWork?.name ?? `Робота #${claimWork.repairWorkId}`;
    const employeeName = claimEmployeesLoading
        ? 'Завантаження виконавця…'
        : getEmployeeDisplayName(employee) ?? `Працівник #${claimWork.employeeId}`;
    const partsTotal = useMemo(
        () => parts.reduce(
            (sum, part) => sum + part.quantity * part.unitPrice,
            0,
        ),
        [parts],
    );

    const partColumns = useMemo<TableColumnDef<ClaimWorkPart>[]>(() => [
        {
            id: 'part',
            header: 'Запчастина',
            accessorFn: row => `${row.partName} ${row.partCode}`,
            cell: ({ row }) => (
                <div className="min-w-0">
                    <div className="truncate font-medium text-ink">
                        {row.original.partName}
                    </div>
                    <div className="truncate text-xs text-ink-muted">
                        {row.original.partCode}
                    </div>
                </div>
            ),
        },
        {
            id: 'quantity',
            header: 'Кількість',
            accessorFn: row => formatPartQuantity(row.quantity, row.unitName),
            meta: { align: 'right' },
            cell: ({ row }) => (
                <span className="font-mono text-sm text-ink">
                    {formatPartQuantity(row.original.quantity, row.original.unitName)}
                </span>
            ),
        },
        {
            id: 'unitPrice',
            header: 'Ціна',
            accessorFn: row => String(row.unitPrice),
            meta: { align: 'right' },
            cell: ({ row }) => (
                <span className="font-mono text-sm text-ink">
                    {formatMoney(row.original.unitPrice)}
                </span>
            ),
        },
        {
            id: 'total',
            header: 'Сума',
            accessorFn: row => String(row.quantity * row.unitPrice),
            meta: { align: 'right' },
            cell: ({ row }) => (
                <span className="font-mono font-semibold text-ink">
                    {formatMoney(row.original.quantity * row.original.unitPrice)}
                </span>
            ),
        },
        {
            id: 'date',
            header: 'Дата',
            accessorFn: row => `${row.createdAt} ${row.updatedAt ?? ''}`,
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
    ], []);

    return (
        <Modal
            title={`Ремонтна робота: ${workName}`}
            onClose={onClose}
            width="xl"
        >
            <div className="space-y-5">
                <div className="rounded-2xl border border-border bg-linear-to-r from-brand-soft to-surface p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0">
                            <div className="text-xs font-medium uppercase tracking-wide text-ink-muted">
                                Виконана робота
                            </div>
                            <div className="mt-2 text-xl font-semibold text-ink">
                                {workName}
                            </div>
                            <div className="mt-2 space-y-1 text-sm text-ink-muted">
                                <div>Заявка #{claimWork.claimId}</div>
                                <div>Виконавець: {employeeName}</div>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <span className="inline-flex rounded-full border border-border bg-surface px-3 py-1 text-sm text-ink">
                                {formatHours(claimWork.timeSpent, '0 год')}
                            </span>
                            {employee && (
                                <span className={`inline-flex rounded-full px-3 py-1 text-sm ${ROLE_IN_CLAIM_COLORS[employee.roleInClaim]}`}>
                                    {ROLE_IN_CLAIM_LABELS[employee.roleInClaim]}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <InfoCard
                        label="Працівник"
                        value={
                            <div className="space-y-2">
                                <div className="font-medium">
                                    {employeeName}
                                </div>
                                {employee ? (
                                    <div className="flex flex-wrap gap-2">
                                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ${EMPLOYEE_POSITION_COLORS[employee.position]}`}>
                                            {EMPLOYEE_POSITION_LABELS[employee.position]}
                                        </span>
                                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ${ROLE_IN_CLAIM_COLORS[employee.roleInClaim]}`}>
                                            {ROLE_IN_CLAIM_LABELS[employee.roleInClaim]}
                                        </span>
                                    </div>
                                ) : (
                                    <div className="text-xs text-ink-muted">
                                        Працівника немає у поточному списку заявки
                                    </div>
                                )}
                            </div>
                        }
                    />
                    <InfoCard
                        label="Час виконання"
                        value={formatHours(claimWork.timeSpent, '0 год')}
                        mono
                    />
                    <InfoCard
                        label="Створено"
                        value={formatDateTime(claimWork.createdAt)}
                    />
                    <InfoCard
                        label="Оновлено"
                        value={
                            claimWork.updatedAt
                                ? formatDateTime(claimWork.updatedAt)
                                : <span className="text-ink-muted">Не оновлювалось</span>
                        }
                    />
                </div>

                {repairWork?.description && (
                    <div className="rounded-xl border border-border bg-surface-muted p-4">
                        <div className="text-xs font-medium uppercase tracking-wide text-ink-muted">
                            Опис роботи
                        </div>
                        <div className="mt-2 whitespace-pre-line text-sm leading-6 text-ink">
                            {repairWork.description}
                        </div>
                    </div>
                )}

                <div className="rounded-xl border border-border bg-surface-muted p-4">
                    <div className="text-xs font-medium uppercase tracking-wide text-ink-muted">
                        Примітка
                    </div>
                    <div className="mt-2 whitespace-pre-line text-sm leading-6 text-ink">
                        {claimWork.note?.trim() || (
                            <span className="text-ink-muted">Примітку не вказано</span>
                        )}
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="text-sm font-medium text-ink">
                            Використані запчастини
                        </div>
                        <div className="rounded border border-border bg-surface px-3 py-1 text-sm">
                            <span className="text-ink-muted">Сума: </span>
                            <span className="font-mono font-semibold text-ink">
                                {formatMoney(partsTotal)}
                            </span>
                        </div>
                    </div>

                    <Table
                        data={parts}
                        columns={partColumns}
                        loading={partsLoading}
                        density="compact"
                        striped
                        storageKey={`claim-work-view-parts-${claimWork.id}`}
                        showPagination={false}
                        renderEmptyState={
                            <div className="text-sm text-ink-muted">
                                Для цієї роботи запчастини не використовувались
                            </div>
                        }
                    />
                </div>
            </div>

            <ModalFooter>
                <Button variant="secondary" onClick={onClose}>
                    Закрити
                </Button>
            </ModalFooter>
        </Modal>
    );
}
