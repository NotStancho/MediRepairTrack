import { useMemo } from 'react';

import type { Invoice } from '../../types/invoice';

import { Table, TableToolbar, type TableColumnDef } from '../../ui/Table';

import { INVOICE_STATUS_LABELS } from '../../utils/invoiceLabels';
import { formatDateShort } from '../../utils/formats/dateShortFormat';
import { formatMoney } from '../../utils/formats/moneyFormat';
import InvoiceStatusBadge from '../../components/badges/InvoiceStatusBadge';

interface Props {
    data: Invoice[];
    loading: boolean;
    onView: (invoice: Invoice) => void;
    storageKey: string;
    globalFilterPlaceholder: string;
    emptyText: string;
    showClientColumn?: boolean;
}

export default function InvoicesTable({
    data,
    loading,
    onView,
    storageKey,
    globalFilterPlaceholder,
    emptyText,
    showClientColumn = false,
}: Props) {
    const columns = useMemo<TableColumnDef<Invoice>[]>(() => {
        const baseColumns: TableColumnDef<Invoice>[] = [
            {
                id: 'invoiceNumber',
                header: 'Рахунок',
                accessorFn: row => `${row.invoiceNumber} ${row.claimId}`,
                cell: ({ row }) => (
                    <div>
                        <div className="font-medium text-ink">
                            {row.original.invoiceNumber}
                        </div>
                        <div className="text-xs text-ink-muted">
                            Заявка #{row.original.claimId}
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
                id: 'status',
                header: 'Статус',
                accessorFn: row => INVOICE_STATUS_LABELS[row.status],
                cell: ({ row }) => <InvoiceStatusBadge status={row.original.status} />,
            },
            {
                id: 'createdAt',
                header: 'Дати',
                accessorFn: row =>
                    `${row.createdAt} ${row.dueAt ?? ''} ${row.issuedAt ?? ''}`,
                cell: ({ row }) => (
                    <div className="space-y-1 text-xs text-ink-muted">
                        <div>
                            Створено:{' '}
                            <span className="text-ink">
                                {formatDateShort(row.original.createdAt)}
                            </span>
                        </div>
                        <div>
                            Оплатити до:{' '}
                            <span className={row.original.status === 'OVERDUE' ? 'font-medium text-red-700' : 'text-ink'}>
                                {row.original.dueAt
                                    ? formatDateShort(row.original.dueAt)
                                    : 'Не встановлено'}
                            </span>
                        </div>
                    </div>
                ),
            },
            {
                id: 'amounts',
                header: 'Суми',
                accessorFn: row =>
                    `${row.totalAmount} ${row.totalPaid} ${row.totalAmount - row.totalPaid}`,
                cell: ({ row }) => {
                    const remaining = row.original.totalAmount - row.original.totalPaid;

                    return (
                        <div className="space-y-1 text-xs text-ink-muted">
                            <div>
                                Всього:{' '}
                                <span className="font-mono text-ink">
                                    {formatMoney(row.original.totalAmount)}
                                </span>
                            </div>
                            <div>
                                Оплачено:{' '}
                                <span className="font-mono text-ink">
                                    {formatMoney(row.original.totalPaid)}
                                </span>
                            </div>
                            <div>
                                Залишок:{' '}
                                <span className="font-mono font-semibold text-ink">
                                    {formatMoney(remaining)}
                                </span>
                            </div>
                        </div>
                    );
                },
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
