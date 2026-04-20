// pages/finance/PaymentsTable.tsx

import { useMemo } from 'react';

import type { PaymentView } from '../../types/payment';

import { Table, TableToolbar, type TableColumnDef } from '../../ui/Table';

import {
    PAYMENT_METHOD_LABELS,
    PAYMENT_STATUS_COLORS,
    PAYMENT_STATUS_LABELS,
} from '../../utils/paymentLabels';
import { formatDateShort } from '../../utils/formats/dateShortFormat';
import { formatMoney } from '../../utils/formats/moneyFormat';

interface Props {
    data: PaymentView[];
    loading: boolean;
    onView: (payment: PaymentView) => void;
    storageKey: string;
    globalFilterPlaceholder: string;
    emptyText: string;
    showClientColumn?: boolean;
}

export default function PaymentsTable({
    data,
    loading,
    onView,
    storageKey,
    globalFilterPlaceholder,
    emptyText,
    showClientColumn = false,
}: Props) {
    const columns = useMemo<TableColumnDef<PaymentView>[]>(() => {
        const baseColumns: TableColumnDef<PaymentView>[] = [
            {
                id: 'amount',
                header: 'Оплата',
                accessorFn: row =>
                    `${row.amount} ${row.invoiceNumber} ${row.claimId}`,
                cell: ({ row }) => (
                    <div>
                        <div className="font-mono font-semibold text-ink">
                            {formatMoney(row.original.amount)}
                        </div>
                        <div className="text-xs text-ink-muted">
                            Рахунок {row.original.invoiceNumber} • Заявка #{row.original.claimId}
                        </div>
                    </div>
                ),
            },
        ];

        if (showClientColumn) {
            baseColumns.push({
                id: 'client',
                header: 'Клієнт',
                accessorFn: row => row.clientOrganizationName,
                cell: ({ row }) => (
                    <div className="max-w-xs text-sm text-ink">
                        {row.original.clientOrganizationName}
                    </div>
                ),
            });
        }

        baseColumns.push(
            {
                id: 'method',
                header: 'Метод',
                accessorFn: row => PAYMENT_METHOD_LABELS[row.method],
                cell: ({ row }) => PAYMENT_METHOD_LABELS[row.original.method],
            },
            {
                id: 'status',
                header: 'Статус',
                accessorFn: row => PAYMENT_STATUS_LABELS[row.status],
                cell: ({ row }) => (
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ${PAYMENT_STATUS_COLORS[row.original.status]}`}>
                        {PAYMENT_STATUS_LABELS[row.original.status]}
                    </span>
                ),
            },
            {
                id: 'createdAt',
                header: 'Дати',
                accessorFn: row => `${row.createdAt} ${row.paidAt ?? ''}`,
                cell: ({ row }) => (
                    <div className="space-y-1 text-xs text-ink-muted">
                        <div>
                            Створено:{' '}
                            <span className="text-ink">
                                {formatDateShort(row.original.createdAt)}
                            </span>
                        </div>
                        <div>
                            Сплачено:{' '}
                            <span className="text-ink">
                                {row.original.paidAt
                                    ? formatDateShort(row.original.paidAt)
                                    : 'Ще ні'}
                            </span>
                        </div>
                    </div>
                ),
            },
            {
                id: 'details',
                header: 'Деталі',
                accessorFn: row =>
                    `${row.provider ?? ''} ${row.externalRef ?? ''}`,
                cell: ({ row }) => (
                    <div className="space-y-1 text-xs text-ink-muted">
                        <div>
                            Провайдер:{' '}
                            <span className="text-ink">
                                {row.original.provider?.trim() || '—'}
                            </span>
                        </div>
                        <div>
                            Ref:{' '}
                            <span className="font-mono text-ink">
                                {row.original.externalRef?.trim() || '—'}
                            </span>
                        </div>
                    </div>
                ),
            },
            {
                id: 'actions',
                header: 'Дії',
                enableSorting: false,
                enableGlobalFilter: false,
                cell: ({ row }) => (
                    <button
                        onClick={event => {
                            event.stopPropagation();
                            onView(row.original);
                        }}
                        className="text-brand hover:underline text-sm"
                    >
                        Переглянути
                    </button>
                ),
            }
        );

        return baseColumns;
    }, [onView, showClientColumn]);

    return (
        <Table
            data={data}
            columns={columns}
            loading={loading}
            density="compact"
            striped
            storageKey={storageKey}
            onRowClick={row => onView(row.original)}
            renderToolbar={table => (
                <TableToolbar
                    table={table}
                    globalFilterPlaceholder={globalFilterPlaceholder}
                />
            )}
            renderEmptyState={
                <div className="text-sm text-ink-muted">
                    {emptyText}
                </div>
            }
            initialState={{
                sorting: [{ id: 'createdAt', desc: true }],
            }}
        />
    );
}
