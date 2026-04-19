// pages/clients/tabs/ContractsTab.tsx

import { useMemo, useState } from 'react';

import { useClientContracts } from '../../../hooks/useClientContracts';
import { useClients } from '../../../hooks/useClients';

import type { ClientContract } from '../../../types/clientContract/clientContract';

import Button from '../../../ui/Button';
import ConfirmBox from '../../../ui/ConfirmBox';
import RowActionsMenu from '../../../ui/RowActionsMenu';
import { Table, type TableColumnDef } from '../../../ui/Table';
import TableToolbar from '../../../ui/Table/TableToolbar';

import {
    CONTRACT_STATUS_COLORS,
    CONTRACT_TYPE_COLORS,
    getContractStatusLabel,
    getContractTypeLabel,
} from '../../../utils/clientContractLabel';
import { formatDateShort } from '../../../utils/formats/dateShortFormat';
import { formatPercent } from '../../../utils/formats/percentFormat';

import CreateClientContractModal from '../modals/CreateClientContractModal';
import EditClientContractModal from '../modals/EditClientContractModal';
import ViewClientContractModal from '../modals/ViewClientContractModal';

export default function ContractsTab() {
    const {
        data,
        loading,
        loadOne,
        create,
        update,
        remove,
        creating,
        updating,
        deletingId,
    } = useClientContracts();

    const {
        data: clients,
        loading: clientsLoading,
    } = useClients();

    const [viewItem, setViewItem] = useState<ClientContract | null>(null);
    const [createOpen, setCreateOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<ClientContract | null>(null);
    const [deleteItem, setDeleteItem] = useState<ClientContract | null>(null);

    const clientMap = useMemo(
        () => new Map(clients.map(client => [client.id, client.organizationName])),
        [clients]
    );

    const handleView = (item: ClientContract) => {
        void loadOne(item.id).then(contract => {
            if (contract) {
                setViewItem(contract);
            }
        });
    };

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
        },
        {
            id: 'actions',
            header: 'Дії',
            enableSorting: false,
            enableGlobalFilter: false,
            cell: ({ row }) => (
                <RowActionsMenu
                    disabled={deletingId === row.original.id}
                    actions={[
                        {
                            label: 'Редагувати',
                            onClick: () => setEditingItem(row.original),
                        },
                        {
                            label: 'Видалити',
                            onClick: () => setDeleteItem(row.original),
                            danger: true,
                        },
                    ]}
                    trigger={
                        <button className="rounded px-2 py-1 hover:bg-surface-muted">
                            ⋯
                        </button>
                    }
                />
            ),
        },
    ], [deletingId]);

    return (
        <div>
            <Table
                data={data}
                columns={columns}
                loading={loading || clientsLoading}
                density="compact"
                striped
                storageKey="client-contracts-table"
                onRowClick={row => handleView(row.original)}
                renderToolbar={table => (
                    <TableToolbar
                        table={table}
                        globalFilterPlaceholder="Пошук за назвою контракту, клієнтом чи типом"
                        rightSlot={
                            <Button
                                variant="primary"
                                onClick={() => setCreateOpen(true)}
                            >
                                + Додати
                            </Button>
                        }
                    />
                )}
                renderEmptyState={
                    <div className="text-sm text-ink-muted">
                        Контракти ще не додані
                    </div>
                }
            />

            {createOpen && (
                <CreateClientContractModal
                    clients={clients}
                    clientsLoading={clientsLoading}
                    creating={creating}
                    onClose={() => setCreateOpen(false)}
                    onCreate={async payload => {
                        const created = await create(payload);
                        setViewItem(created);
                    }}
                />
            )}

            {editingItem && (
                <EditClientContractModal
                    contract={editingItem}
                    clients={clients}
                    clientsLoading={clientsLoading}
                    updating={updating}
                    onClose={() => setEditingItem(null)}
                    onSave={async payload => {
                        const updated = await update(editingItem.id, payload);
                        setEditingItem(updated);
                        setViewItem(current =>
                            current?.id === updated.id ? updated : current
                        );
                    }}
                />
            )}

            {viewItem && (
                <ViewClientContractModal
                    contract={viewItem}
                    clientName={
                        clientMap.get(viewItem.clientId) ??
                        viewItem.clientOrganizationName
                    }
                    onClose={() => setViewItem(null)}
                />
            )}

            {deleteItem && (
                <ConfirmBox
                    title="Видалити контракт?"
                    description={`${deleteItem.contractName} • ${deleteItem.clientOrganizationName}`}
                    confirmText="Видалити"
                    confirmVariant="danger"
                    onConfirm={async () => {
                        await remove(deleteItem.id);
                        setViewItem(current =>
                            current?.id === deleteItem.id ? null : current
                        );
                        setDeleteItem(null);
                    }}
                    onCancel={() => setDeleteItem(null)}
                />
            )}
        </div>
    );
}
