import { useEffect, useMemo, useState } from 'react';
import { getUsedPartsByClaim } from '../../../api/usedPart';
import type { UsedPart } from '../../../types/usedPart';
import { formatMoney } from '../../../utils/moneyFormat';
import { Table, TableToolbar, type TableColumnDef } from '../../../ui/Table';

interface Props {
    claimId: number;
}

const formatQty = (v: number) =>
    Number.isInteger(v) ? v.toString() : v.toString();

export default function ClaimPartsTab({ claimId }: Props) {
    const [items, setItems] = useState<UsedPart[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getUsedPartsByClaim(claimId)
            .then(setItems)
            .finally(() => setLoading(false));
    }, [claimId]);

    const totalSum = useMemo(
        () =>
            items.reduce(
                (sum, p) => sum + p.quantity * p.unitPrice,
                0
            ),
        [items]
    );

    const columns = useMemo<TableColumnDef<UsedPart>[]>(() => [
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
                        Запчастини не використовувались
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
