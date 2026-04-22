// pages/deliveries/DeliveriesTable

import { useMemo } from 'react';

import type { DeliveryView } from '../../types/delivery';

import { Table, TableToolbar, type TableColumnDef } from '../../ui/Table';

import {
    DELIVERY_PROVIDER_LABELS,
    DELIVERY_STATUS_COLORS,
    DELIVERY_STATUS_LABELS,
    DELIVERY_TYPE_COLORS,
    DELIVERY_TYPE_LABELS,
} from '../../utils/deliveryLabels';
import { formatDateShort } from '../../utils/formats/dateShortFormat';
import { formatMoney } from '../../utils/formats/moneyFormat';

interface Props {
    data: DeliveryView[];
    loading: boolean;
    onView: (delivery: DeliveryView) => void;
    storageKey: string;
    globalFilterPlaceholder: string;
    emptyText: string;
    showClientColumn?: boolean;
}

function getDeliveryTotal(delivery: DeliveryView) {
    if (delivery.price != null) {
        return delivery.price;
    }

    if (delivery.distanceKm != null && delivery.pricePerUnit != null) {
        return delivery.distanceKm * delivery.pricePerUnit;
    }

    return null;
}

function formatKm(value?: number | null) {
    if (value == null) {
        return '—';
    }

    return `${value.toLocaleString('uk-UA', { maximumFractionDigits: 2 })} км`;
}

export default function DeliveriesTable({
    data,
    loading,
    onView,
    storageKey,
    globalFilterPlaceholder,
    emptyText,
    showClientColumn = false,
}: Props) {
    const columns = useMemo<TableColumnDef<DeliveryView>[]>(() => {
        const baseColumns: TableColumnDef<DeliveryView>[] = [
            {
                id: 'delivery',
                header: 'Доставка',
                accessorFn: row =>
                    `${DELIVERY_TYPE_LABELS[row.type]} ${DELIVERY_PROVIDER_LABELS[row.provider]} ${row.claimId} ${row.trackingCode ?? ''}`,
                cell: ({ row }) => {
                    const isEngineer = row.original.type === 'ENGINEER_ON_SITE';

                    return (
                        <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <span
                                    className={`inline-flex rounded-full px-2 py-0.5 text-xs ${DELIVERY_TYPE_COLORS[row.original.type]}`}>
                                    {DELIVERY_TYPE_LABELS[row.original.type]}
                                </span>
                                {!isEngineer && (
                                    <span className="text-xs text-ink-muted">
                                        {DELIVERY_PROVIDER_LABELS[row.original.provider]}
                                    </span>
                                )}
                            </div>
                        </div>
                    )
                }
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
                id: 'claim',
                header: 'Заявка',
                accessorFn: row => row.claimId,
                cell: ({ row }) => (
                    <span className="font-mono text-sm text-ink-muted">
                        #{row.original.claimId}
                    </span>
                ),
            },
            {
                id: 'status',
                header: 'Статус',
                accessorFn: row => DELIVERY_STATUS_LABELS[row.status],
                cell: ({ row }) => (
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ${DELIVERY_STATUS_COLORS[row.original.status]}`}>
                        {DELIVERY_STATUS_LABELS[row.original.status]}
                    </span>
                ),
            },
            {
                id: 'details',
                header: 'Деталі',
                accessorFn: row =>
                    row.type === 'ENGINEER_ON_SITE'
                        ? `${row.distanceKm ?? ''} ${row.pricePerUnit ?? ''}`
                        : `${DELIVERY_PROVIDER_LABELS[row.provider]} ${row.trackingCode ?? ''}`,
                cell: ({ row }) => (
                    row.original.type === 'ENGINEER_ON_SITE' ? (
                        <div className="space-y-1 text-xs text-ink-muted">
                            <div>
                                Відстань:{' '}
                                <span className="text-ink">
                                    {formatKm(row.original.distanceKm)}
                                </span>
                            </div>
                            <div>
                                Тариф:{' '}
                                <span className="font-mono text-ink">
                                    {row.original.pricePerUnit != null
                                        ? `${formatMoney(row.original.pricePerUnit)} / км`
                                        : '—'}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-1 text-xs text-ink-muted">
                            <div>
                                Провайдер:{' '}
                                <span className="text-ink">
                                    {DELIVERY_PROVIDER_LABELS[row.original.provider]}
                                </span>
                            </div>
                            <div>
                                Трек:{' '}
                                <span className="font-mono text-ink">
                                    {row.original.trackingCode?.trim() || '—'}
                                </span>
                            </div>
                        </div>
                    )
                ),
            },
            {
                id: 'price',
                header: 'Вартість',
                accessorFn: row => {
                    const total = getDeliveryTotal(row);
                    return total == null ? '' : String(total);
                },
                cell: ({ row }) => {
                    const total = getDeliveryTotal(row.original);

                    return (
                        <span className="font-mono font-semibold text-ink">
                            {total != null ? formatMoney(total) : '—'}
                        </span>
                    );
                },
            },
            {
                id: 'dates',
                header: 'Дати',
                accessorFn: row =>
                    `${row.createdAt} ${row.performedAt ?? ''} ${row.updatedAt ?? ''}`,
                cell: ({ row }) => (
                    <div className="space-y-1 text-xs text-ink-muted">
                        <div>
                            Створено:{' '}
                            <span className="text-ink">
                                {formatDateShort(row.original.createdAt)}
                            </span>
                        </div>
                        <div>
                            Виконано:{' '}
                            <span className="text-ink">
                                {row.original.performedAt
                                    ? formatDateShort(row.original.performedAt)
                                    : 'Ще ні'}
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
                sorting: [{ id: 'dates', desc: true }],
            }}
        />
    );
}
