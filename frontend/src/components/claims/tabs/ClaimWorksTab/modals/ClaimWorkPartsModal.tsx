// components/claim/tabs/ClaimWorksTab/modals/ClaimWorkPartsModal

import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';

import { useClaimWorkParts } from '../../../../../hooks/useClaimWorkParts';
import { usePart } from '../../../../../hooks/usePart';

import type { ClaimWork } from '../../../../../types/claim/claimWork';
import type { ClaimWorkPart } from '../../../../../types/claim/claimWorkPart';
import type { Part } from '../../../../../types/part/part';

import Button from '../../../../../ui/Button';
import ConfirmBox from '../../../../../ui/ConfirmBox';
import InputField from '../../../../../ui/InputField';
import Modal from '../../../../../ui/Modal/Modal';
import ModalFooter from '../../../../../ui/Modal/ModalFooter';
import Select from '../../../../../ui/Select';
import { Table, TableToolbar, type TableColumnDef } from '../../../../../ui/Table';
import { inputBase } from '../../../../../ui/formStyles';

interface Props {
    claimWork: ClaimWork;
    repairWorkName: string;
    canManage: boolean;
    employeeId: number | null;
    onClose: () => void;
    onChanged?: () => Promise<void> | void;
}

function formatQty(value: number) {
    return Number.isInteger(value)
        ? String(value)
        : value.toFixed(3).replace(/\.?0+$/, '');
}

function parsePositiveQuantity(value: string) {
    const normalized = value.replace(',', '.').trim();
    const parsed = Number(normalized);

    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function getQuantityError(part: Part | undefined, quantity: number | null, maxQuantity?: number) {
    if (quantity == null) {
        return 'Вкажіть коректну кількість більше 0';
    }

    if (part?.unitType === 'PIECE' && !Number.isInteger(quantity)) {
        return `Для одиниці "${part.unitName}" потрібне ціле число`;
    }

    if (maxQuantity != null && quantity > maxQuantity) {
        return `На складі доступно: ${formatQty(maxQuantity)} ${part?.unitName ?? ''}`;
    }

    return undefined;
}

export default function ClaimWorkPartsModal({
    claimWork,
    repairWorkName,
    canManage,
    employeeId,
    onClose,
    onChanged,
}: Props) {
    const {
        data: items,
        loading,
        creating,
        updatingPartId,
        deletingPartId,
        create,
        updateQuantity,
        remove,
    } = useClaimWorkParts(claimWork.id);

    const {
        data: parts,
        loading: partsLoading,
        refresh: refreshParts,
    } = usePart();

    const [selectedPartId, setSelectedPartId] = useState<number | null>(null);
    const [quantity, setQuantity] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const [editingPartId, setEditingPartId] = useState<number | null>(null);
    const [editingQuantity, setEditingQuantity] = useState('');
    const [editingSubmitted, setEditingSubmitted] = useState(false);
    const [deleteItem, setDeleteItem] = useState<ClaimWorkPart | null>(null);

    const partById = useMemo(
        () => new Map(parts.map(part => [part.id, part])),
        [parts],
    );

    const selectedPart = selectedPartId != null
        ? partById.get(selectedPartId)
        : undefined;

    const availableParts = useMemo(
        () => parts.filter(part => part.stockQuantity > 0 || part.id === selectedPartId),
        [parts, selectedPartId],
    );

    const parsedQuantity = useMemo(
        () => parsePositiveQuantity(quantity),
        [quantity],
    );

    const quantityError = submitted
        ? getQuantityError(selectedPart, parsedQuantity, selectedPart?.stockQuantity)
        : undefined;

    const selectedPartError = submitted && selectedPartId == null
        ? 'Запчастина обовʼязкова'
        : undefined;

    const canSubmitCreate =
        canManage &&
        employeeId != null &&
        selectedPartId != null &&
        !getQuantityError(selectedPart, parsedQuantity, selectedPart?.stockQuantity);

    const handleCreate = async () => {
        setSubmitted(true);

        if (!canSubmitCreate || selectedPartId == null || parsedQuantity == null || employeeId == null) {
            return;
        }

        await create({ partId: selectedPartId, quantity: parsedQuantity }, employeeId);
        await refreshParts();
        await onChanged?.();

        setSelectedPartId(null);
        setQuantity('');
        setSubmitted(false);
        toast.success('Запчастину додано до роботи');
    };

    const startEdit = (item: ClaimWorkPart) => {
        setEditingPartId(item.partId);
        setEditingQuantity(String(item.quantity));
        setEditingSubmitted(false);
    };

    const cancelEdit = () => {
        setEditingPartId(null);
        setEditingQuantity('');
        setEditingSubmitted(false);
    };

    const handleUpdate = async (item: ClaimWorkPart) => {
        setEditingSubmitted(true);

        const parsed = parsePositiveQuantity(editingQuantity);
        const catalogPart = partById.get(item.partId);
        const maxQuantity = catalogPart
            ? catalogPart.stockQuantity + item.quantity
            : undefined;
        const error = getQuantityError(catalogPart, parsed, maxQuantity);

        if (error || parsed == null || employeeId == null) {
            return;
        }

        await updateQuantity(
            { partId: item.partId, newQuantity: parsed },
            employeeId,
        );
        await refreshParts();
        await onChanged?.();

        cancelEdit();
        toast.success('Кількість запчастини оновлено');
    };

    const handleDelete = async () => {
        if (!deleteItem || employeeId == null) {
            return;
        }

        await remove(deleteItem.partId, employeeId);
        await refreshParts();
        await onChanged?.();

        toast.success('Запчастину видалено з роботи');
        setDeleteItem(null);
    };

    const columns: TableColumnDef<ClaimWorkPart>[] = [
        {
            id: 'partName',
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
            accessorFn: row => row.quantity,
            meta: { align: 'right' },
            cell: ({ row }) => {
                const item = row.original;
                const isEditing = editingPartId === item.partId;
                const catalogPart = partById.get(item.partId);
                const parsedEditingQuantity = parsePositiveQuantity(editingQuantity);
                const editMaxQuantity = catalogPart
                    ? catalogPart.stockQuantity + item.quantity
                    : undefined;
                const editError = editingSubmitted && isEditing
                    ? getQuantityError(catalogPart, parsedEditingQuantity, editMaxQuantity)
                    : undefined;

                if (!isEditing) {
                    return (
                        <span className="font-mono">
                            {formatQty(item.quantity)} {item.unitName}
                        </span>
                    );
                }

                return (
                    <div className="ml-auto max-w-32 space-y-1">
                        <input
                            type="number"
                            min="0.001"
                            step={catalogPart?.unitType === 'PIECE' ? 1 : 0.001}
                            value={editingQuantity}
                            onChange={event => setEditingQuantity(event.target.value)}
                            className={`${inputBase} h-9 text-right font-mono`}
                            disabled={updatingPartId === item.partId}
                        />
                        {editError && (
                            <div className="text-left text-xs text-danger">
                                {editError}
                            </div>
                        )}
                    </div>
                );
            },
        },
        {
            id: 'actions',
            header: 'Дії',
            enableSorting: false,
            enableGlobalFilter: false,
            meta: { align: 'right', headerClassName: 'w-36' },
            cell: ({ row }) => {
                if (!canManage) {
                    return null;
                }

                const item = row.original;
                const isEditing = editingPartId === item.partId;

                if (isEditing) {
                    return (
                        <div className="flex justify-end gap-2 text-xs">
                            <button
                                type="button"
                                className="font-medium text-brand hover:text-brand-strong disabled:text-ink-muted"
                                disabled={updatingPartId === item.partId}
                                onClick={() => void handleUpdate(item)}
                            >
                                Зберегти
                            </button>
                            <button
                                type="button"
                                className="font-medium text-ink-muted hover:text-ink"
                                disabled={updatingPartId === item.partId}
                                onClick={cancelEdit}
                            >
                                Скасувати
                            </button>
                        </div>
                    );
                }

                return (
                    <div className="flex justify-end gap-2 text-xs">
                        <button
                            type="button"
                            className="font-medium text-brand hover:text-brand-strong disabled:text-ink-muted"
                            disabled={deletingPartId === item.partId}
                            onClick={() => startEdit(item)}
                        >
                            Змінити
                        </button>
                        <button
                            type="button"
                            className="font-medium text-danger hover:text-danger-strong disabled:text-ink-muted"
                            disabled={deletingPartId === item.partId}
                            onClick={() => setDeleteItem(item)}
                        >
                            Видалити
                        </button>
                    </div>
                );
            },
        },
    ];

    return (
        <>
            <Modal
                title={`Запчастини: ${repairWorkName}`}
                onClose={onClose}
                width="xl"
            >
                <div className="space-y-5">
                    {canManage && (
                        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_8rem_auto] md:items-end">
                            <InputField
                                label="Запчастина"
                                required
                                showRequired={submitted && selectedPartId == null}
                                error={selectedPartError}
                                helperText={!partsLoading && availableParts.length === 0
                                    ? 'Немає запчастин із доступним залишком'
                                    : undefined
                                }
                            >
                                <Select
                                    value={selectedPartId}
                                    onChange={setSelectedPartId}
                                    options={availableParts}
                                    getValue={part => part.id}
                                    getLabel={part => `${part.partCode} ${part.partName}`}
                                    renderOption={part => (
                                        <div className="min-w-0 py-1">
                                            <div className="truncate font-medium text-ink">
                                                {part.partName}
                                            </div>
                                            <div className="text-xs text-ink-muted">
                                                {part.partCode} · {formatQty(part.stockQuantity)} {part.unitName}
                                            </div>
                                        </div>
                                    )}
                                    renderValue={part => part.partName}
                                    placeholder="Оберіть запчастину"
                                    searchable
                                    loading={partsLoading}
                                    loadingText="Завантаження запчастин…"
                                    disabled={creating || (!partsLoading && availableParts.length === 0)}
                                    invalid={!!selectedPartError}
                                    itemHeight={52}
                                    maxVisibleItems={5}
                                />
                            </InputField>

                            <InputField
                                label="Кількість"
                                required
                                showRequired={!!quantityError}
                                error={quantityError}
                                helperText={selectedPart
                                    ? `Склад: ${formatQty(selectedPart.stockQuantity)} ${selectedPart.unitName}`
                                    : undefined
                                }
                            >
                                <input
                                    type="number"
                                    min="0.001"
                                    step={selectedPart?.unitType === 'PIECE' ? 1 : 0.001}
                                    value={quantity}
                                    onChange={event => setQuantity(event.target.value)}
                                    className={`${inputBase} font-mono`}
                                    disabled={creating}
                                />
                            </InputField>

                            <Button
                                variant="primary"
                                onClick={handleCreate}
                                disabled={creating || partsLoading || employeeId == null}
                            >
                                {creating ? 'Додавання…' : 'Додати'}
                            </Button>
                        </div>
                    )}

                    <Table
                        data={items}
                        columns={columns}
                        loading={loading}
                        density="compact"
                        storageKey={`claim-work-parts-${claimWork.id}`}
                        showPagination={false}
                        renderToolbar={table => (
                            <TableToolbar
                                table={table}
                                globalFilterPlaceholder="Пошук за назвою або кодом"
                                enableColumnVisibility={false}
                                enableResetAll={false}
                            />
                        )}
                        renderEmptyState={
                            <div className="text-sm text-ink-muted">
                                До цієї роботи ще не додано запчастин
                            </div>
                        }
                    />
                </div>

                <ModalFooter>
                    <Button variant="secondary" onClick={onClose}>
                        Закрити
                    </Button>
                </ModalFooter>
            </Modal>

            {deleteItem && (
                <ConfirmBox
                    title="Видалити запчастину з роботи?"
                    description={`${deleteItem.partName} (${formatQty(deleteItem.quantity)} ${deleteItem.unitName})`}
                    confirmText="Видалити"
                    confirmVariant="danger"
                    onConfirm={() => void handleDelete()}
                    onCancel={() => setDeleteItem(null)}
                />
            )}
        </>
    );
}
