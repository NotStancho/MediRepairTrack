// pages/claims/tabs/ClaimDeliveryTab.tsx

import { useEffect, useMemo, useState } from 'react';
import { getDeliveriesByClaim } from '../../../api/delivery';
import type { Delivery } from '../../../types/delivery';
import { DELIVERY_PROVIDER_LABELS, DELIVERY_STATUS_LABELS, DELIVERY_TYPE_LABELS } from '../../../utils/deliveryLabels';
import { formatMoney } from '../../../utils/formats/moneyFormat';
import { Table, TableToolbar, type TableColumnDef } from '../../../ui/Table';

interface Props {
    claimId: number;
}

export default function ClaimDeliveryTab({ claimId }: Props) {
    const [items, setItems] = useState<Delivery[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getDeliveriesByClaim(claimId)
            .then(setItems)
            .finally(() => setLoading(false));
    }, [claimId]);

    const columns = useMemo<TableColumnDef<Delivery>[]>(() => [
        {
            id: 'type',
            header: 'Тип',
            accessorFn: row => DELIVERY_TYPE_LABELS[row.type],
            cell: ({ row }) => DELIVERY_TYPE_LABELS[row.original.type],
        },
        {
            id: 'provider',
            header: 'Провайдер',
            accessorFn: row => DELIVERY_PROVIDER_LABELS[row.provider],
            cell: ({ row }) => DELIVERY_PROVIDER_LABELS[row.original.provider],
        },
        {
            id: 'status',
            header: 'Статус',
            accessorFn: row => DELIVERY_STATUS_LABELS[row.status],
            cell: ({ row }) => DELIVERY_STATUS_LABELS[row.original.status],
        },
        {
            id: 'tracking',
            header: 'Трек / Дистанція',
            accessorFn: row =>
                row.type === 'ENGINEER_ON_SITE'
                    ? `${row.distanceKm ?? ''} км`
                    : (row.trackingCode ?? '–'),
            meta: { cellClassName: 'text-sm text-ink-muted' },
            enableSorting: false,
            cell: ({ row }) => {
                const isEngineer = row.original.type === 'ENGINEER_ON_SITE';
                return isEngineer
                    ? `${row.original.distanceKm} км`
                    : row.original.trackingCode ?? '–';
            },
        },
        {
            id: 'tariff',
            header: 'Тариф',
            accessorFn: row =>
                row.type === 'ENGINEER_ON_SITE' && row.pricePerUnit != null
                    ? `${row.pricePerUnit} / км`
                    : 'Фіксована',
            meta: { align: 'right' },
            enableSorting: false,
            cell: ({ row }) => (
                row.original.type === 'ENGINEER_ON_SITE' && row.original.pricePerUnit != null
                    ? <span className="font-mono">{formatMoney(row.original.pricePerUnit)} / км</span>
                    : 'Фіксована'
            ),
        },
        {
            id: 'total',
            header: 'Вартість',
            accessorFn: row => {
                const total =
                    row.price ??
                    (row.distanceKm && row.pricePerUnit ? row.distanceKm * row.pricePerUnit : null);
                return total != null ? String(total) : '';
            },
            meta: { align: 'right' },
            enableSorting: false,
            cell: ({ row }) => {
                const total =
                    row.original.price ??
                    (row.original.distanceKm && row.original.pricePerUnit
                        ? row.original.distanceKm * row.original.pricePerUnit
                        : null);

                return total != null
                    ? <span className="font-mono font-semibold">{formatMoney(total)}</span>
                    : '-';
            },
        },
    ], []);

    return (
        <Table
            data={items}
            columns={columns}
            loading={loading}
            density="compact"
            storageKey="claim-delivery-tab"
            showPagination={false}
            renderToolbar={(table) => (
                <TableToolbar
                    table={table}
                    globalFilterPlaceholder="Пошук за типом, провайдером, статусом або треком"
                />
            )}
            renderEmptyState={
                <div className="text-sm text-ink-muted">
                    Доставки відсутні
                </div>
            }
        />
    );
}
