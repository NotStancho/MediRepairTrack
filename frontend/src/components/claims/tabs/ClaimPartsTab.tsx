// components/claims/tabs/ClaimPartsTab

import { useMemo } from 'react';

import { useClaimPartsByClaim } from '../../../hooks/useClaimWorkParts';
import type { ClaimWorkPart } from '../../../types/claim/claimWorkPart';

import { formatMoney } from '../../../utils/formats/moneyFormat';
import { Table, TableToolbar, type TableColumnDef } from '../../../ui/Table';

interface Props {
    claimId: number;
}

function formatQty(value: number) {
    return Number.isInteger(value)
        ? String(value)
        : value.toFixed(3).replace(/\.?0+$/, '');
}

interface ClaimPartSummary {
    partId: number;
    partCode: string;
    partName: string;
    quantity: number;
    unitPrice: number;
    unitName: string;
    claimWorkCount: number;
}

function aggregateParts(items: ClaimWorkPart[]): ClaimPartSummary[] {
    const byPart = new Map<number, ClaimPartSummary>();

    for (const item of items) {
        const existing = byPart.get(item.partId);

        if (existing) {
            existing.quantity += item.quantity;
            existing.claimWorkCount += 1;
        } else {
            byPart.set(item.partId, {
                partId: item.partId,
                partCode: item.partCode,
                partName: item.partName,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                unitName: item.unitName,
                claimWorkCount: 1,
            });
        }
    }

    return [...byPart.values()].sort((left, right) =>
        left.partName.localeCompare(right.partName, 'uk'),
    );
}

export default function ClaimPartsTab({ claimId }: Props) {
    const {
        data: claimWorkParts,
        loading,
    } = useClaimPartsByClaim(claimId);

    const items = useMemo(
        () => aggregateParts(claimWorkParts),
        [claimWorkParts],
    );

    const totalSum = useMemo(
        () =>
            items.reduce(
                (sum, p) => sum + p.quantity * p.unitPrice,
                0
            ),
        [items]
    );

    const columns = useMemo<TableColumnDef<ClaimPartSummary>[]>(() => [
        {
            id: 'partName',
            header: 'Запчастина',
            accessorFn: row => row.partName,
            cell: ({ row }) => (
                <span className="font-medium">
                    {row.original.partName}
                </span>
            ),
        },
        {
            id: 'partCode',
            header: 'Код',
            accessorFn: row => row.partCode ?? '',
            meta: { cellClassName: 'text-ink-muted' },
            cell: ({ row }) => row.original.partCode ?? '—',
        },
        {
            id: 'quantity',
            header: 'Кількість',
            accessorFn: row =>
                `${formatQty(row.quantity)} ${row.unitName}`,
            meta: { align: 'right' },
            cell: ({ row }) => (
                <span className="font-mono">
                    {formatQty(row.original.quantity)} {row.original.unitName}
                </span>
            ),
        },
        {
            id: 'price',
            header: 'Ціна',
            accessorFn: row => String(row.unitPrice),
            meta: { align: 'right' },
            cell: ({ row }) => (
                <span className="font-mono">
                    {formatMoney(row.original.unitPrice)}
                </span>
            ),
        },
        {
            id: 'total',
            header: 'Сума',
            accessorFn: row =>
                String(row.quantity * row.unitPrice),
            meta: { align: 'right' },
            cell: ({ row }) => (
                <span className="font-mono font-semibold">
                    {formatMoney(row.original.quantity * row.original.unitPrice)}
                </span>
            ),
        },
    ], []);


    return (
        <div className="relative space-y-4">
            <Table
                data={items}
                columns={columns}
                loading={loading}
                density="compact"
                storageKey="claim-parts-tab"
                showPagination={false}
                renderToolbar={(table) => (
                    <TableToolbar
                        table={table}
                        globalFilterPlaceholder="Пошук за назвою або кодом"
                    />
                )}
                renderEmptyState={
                    <div className="text-sm text-ink-muted">
                        Запчастини не використовувались у ремонтних роботах
                    </div>
                }
            />

            {/* Sticky summary */}
            {items.length > 0 && (
                <div className="sticky bottom-0 z-20 bg-surface border-t border-border">
                    <div className="flex justify-end px-4 py-3 text-sm">
                        <div className="flex gap-4 rounded bg-surface-muted px-4 py-2 border border-border shadow-sm">
                            <span className="text-ink-muted">
                                Всього запчастин:
                            </span>
                            <span className="font-semibold font-mono">
                                {formatMoney(totalSum)}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
