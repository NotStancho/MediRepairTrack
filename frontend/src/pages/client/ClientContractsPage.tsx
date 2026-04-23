// // pages/client/ClientContractsPage.tsx

import { useCallback, useMemo, useState } from 'react';

import { useAuth } from '../../context/AuthContext';
import { useClientContracts } from '../../hooks/useClientContracts';

import type { ClientContract } from '../../types/clientContract/clientContract';

import { Table, TableToolbar, type TableColumnDef } from '../../ui/Table';

import {
    CONTRACT_STATUS_COLORS,
    CONTRACT_TYPE_COLORS,
    getContractStatusLabel,
    getContractTypeLabel,
} from '../../utils/clientContractLabel';
import { formatDateShort } from '../../utils/formats/dateShortFormat';
import { formatPercent } from '../../utils/formats/percentFormat';

import ViewClientContractModal from '../clients/modals/ViewClientContractModal';

export default function ClientContractsPage() {
    const { user } = useAuth();
    const {
        data,
        loading,
        loadOne,
    } = useClientContracts({
        scope: 'client',
        clientId: user?.clientId ?? null,
    });

    const [viewItem, setViewItem] = useState<ClientContract | null>(null);

    const handleView = useCallback((item: ClientContract) => {
        void loadOne(item.id).then(contract => {
            if (contract) {
                setViewItem(contract);
            }
        });
    }, [loadOne]);

    const columns = useMemo<TableColumnDef<ClientContract>[]>(() => [
        {
            id: 'contractName',
            header: 'Контракт',
            accessorFn: row => `${row.contractName} ${row.clientOrganizationName}`,
            cell: ({ row }) => (
                <div>
                    <div className="font-medium text-ink">
                        {row.original.contractName}
                    </div>
                    <div className="text-xs text-ink-muted">
                        {row.original.clientOrganizationName}
                    </div>
                </div>
            ),
        },
        {
            id: 'contractType',
            header: 'Тип',
            accessorFn: row => getContractTypeLabel(row.contractType),
            cell: ({ row }) => (
                <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ${CONTRACT_TYPE_COLORS[row.original.contractType]}`}>
                    {getContractTypeLabel(row.original.contractType)}
                </span>
            ),
        },
        {
            id: 'status',
            header: 'Статус',
            accessorFn: row => getContractStatusLabel(row.status),
            cell: ({ row }) => (
                <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ${CONTRACT_STATUS_COLORS[row.original.status]}`}>
                    {getContractStatusLabel(row.original.status)}
                </span>
            ),
        },
        {
            id: 'period',
            header: 'Період дії',
            accessorFn: row => `${row.validFrom} ${row.validTo}`,
            cell: ({ row }) => (
                <div className="text-sm text-ink-muted">
                    {formatDateShort(row.original.validFrom)} - {formatDateShort(row.original.validTo)}
                </div>
            ),
        },
        {
            id: 'discounts',
            header: 'Знижки',
            accessorFn: row =>
                `${row.discountLabor} ${row.discountParts} ${row.discountDelivery}`,
            cell: ({ row }) => (
                <div className="space-y-1 text-xs text-ink-muted">
                    <div>Роботи: <span className="font-mono text-ink">{formatPercent(row.original.discountLabor)}</span></div>
                    <div>Запчастини: <span className="font-mono text-ink">{formatPercent(row.original.discountParts)}</span></div>
                    <div>Доставка: <span className="font-mono text-ink">{formatPercent(row.original.discountDelivery)}</span></div>
                </div>
            ),
        }
    ], [handleView]);

    if (!user?.clientId) {
        return (
            <div className="space-y-4">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold">Мої контракти</h1>
                    <p className="text-sm text-ink-muted">
                        Перегляд укладених договорів клієнта.
                    </p>
                </div>

                <div className="rounded-2xl border border-border bg-surface p-6 text-sm text-ink-muted">
                    Для цього акаунта не прив&apos;язано клієнта.
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <Table
                data={data}
                columns={columns}
                loading={loading}
                density="compact"
                striped
                storageKey="client-own-contracts-table"
                onRowClick={row => handleView(row.original)}
                renderToolbar={table => (
                    <TableToolbar
                        table={table}
                        globalFilterPlaceholder="Пошук за назвою контракту, типом або статусом"
                    />
                )}
                renderEmptyState={
                    <div className="text-sm text-ink-muted">
                        У вас ще немає контрактів
                    </div>
                }
            />

            {viewItem && (
                <ViewClientContractModal
                    contract={viewItem}
                    clientName={viewItem.clientOrganizationName}
                    onClose={() => setViewItem(null)}
                />
            )}
        </div>
    );
}
