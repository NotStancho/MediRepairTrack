// pages/clients/tabs/ClientsListTab.tsx

import { useMemo, useState } from 'react';

import { useClients } from '../../../hooks/useClients';

import type { Client } from '../../../types/client/client';
import type { ClientFull } from '../../../types/client/clientFull';

import Button from '../../../ui/Button';
import ConfirmBox from '../../../ui/ConfirmBox';
import RowActionsMenu from '../../../ui/RowActionsMenu';
import { Table, type TableColumnDef } from '../../../ui/Table';
import TableToolbar from '../../../ui/Table/TableToolbar';

import CreateClientModal from '../modals/CreateClientModal';
import EditClientModal from '../modals/EditClientModal';
import ViewClientModal from '../modals/ViewClientModal';
import { formatPhoneNumber } from '../../../utils/phone';

export default function ClientsListTab() {
    const {
        data,
        loading,
        loadFull,
        create,
        update,
        remove,
        creating,
        updating,
        deletingId,
    } = useClients();

    const [viewItem, setViewItem] = useState<ClientFull | null>(null);
    const [createOpen, setCreateOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Client | null>(null);
    const [deleteItem, setDeleteItem] = useState<Client | null>(null);

    const handleView = (item: Client) => {
        void loadFull(item.id).then(full => {
            if (full) {
                setViewItem(full);
            }
        });
    };

    const columns = useMemo<TableColumnDef<Client>[]>(() => [
        {
            id: 'organization',
            header: 'Клієнт',
            accessorFn: row =>
                `${row.organizationName} ${row.contactPersonName ?? ''}`,
            cell: ({ row }) => (
                <div>
                    <div className="font-medium text-ink">
                        {row.original.organizationName}
                    </div>
                    <div className="text-xs text-ink-muted">
                        Контактна особа: {row.original.contactPersonName ?? '—'}
                    </div>
                </div>
            ),
        },
        {
            id: 'organizationEmail',
            header: 'Email',
            accessorFn: row => row.organizationEmail,
            cell: ({ row }) => (
                <span className="text-sm text-ink">
                    {row.original.organizationEmail}
                </span>
            ),
        },
        {
            id: 'organizationPhoneNumber',
            header: 'Телефон',
            accessorFn: row => row.organizationPhoneNumber,
            cell: ({ row }) => (
                <span className="font-mono text-sm text-ink-muted">
                    {formatPhoneNumber(row.original.organizationPhoneNumber)}
                </span>
            ),
        },
        {
            id: 'address',
            header: 'Адреса',
            accessorFn: row => row.address,
            cell: ({ row }) => (
                <div className="max-w-xl text-sm text-ink-muted line-clamp-2">
                    {row.original.address}
                </div>
            ),
        },
        {
            id: 'userId',
            header: 'Кабінет',
            accessorFn: row => row.userId ?? 0,
            cell: ({ row }) => (
                row.original.userId ? (
                    <span className="font-mono text-sm text-ink-muted">
                        #{row.original.userId}
                    </span>
                ) : (
                    <span className="text-sm text-ink-muted">Немає</span>
                )
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
                loading={loading}
                density="compact"
                striped
                storageKey="clients-table"
                onRowClick={row => handleView(row.original)}
                renderToolbar={table => (
                    <TableToolbar
                        table={table}
                        globalFilterPlaceholder="Пошук за організацією, email, телефоном чи адресою"
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
                        Клієнти ще не додані
                    </div>
                }
            />

            {createOpen && (
                <CreateClientModal
                    creating={creating}
                    onClose={() => setCreateOpen(false)}
                    onCreate={async payload => {
                        await create(payload);
                    }}
                />
            )}

            {editingItem && (
                <EditClientModal
                    client={editingItem}
                    updating={updating}
                    onClose={() => setEditingItem(null)}
                    onSave={async payload => {
                        const updated = await update(editingItem.id, payload);

                        setEditingItem(updated);
                        if (viewItem?.id === updated.id) {
                            const full = await loadFull(updated.id);
                            if (full) {
                                setViewItem(full);
                            }
                        }
                    }}
                />
            )}

            {viewItem && (
                <ViewClientModal
                    client={viewItem}
                    onClose={() => setViewItem(null)}
                />
            )}

            {deleteItem && (
                <ConfirmBox
                    title="Видалити клієнта?"
                    description={deleteItem.organizationName}
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
