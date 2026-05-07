// pages/claim/tabs/ClaimWorksTab/modals/ClaimWorkPartsModal

import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';

import { useClaimWorkParts } from '../../../../../hooks/useClaimWorkParts';
import { usePart } from '../../../../../hooks/usePart';

import type { ClaimWork } from '../../../../../types/claim/claimWork';
import type { ClaimWorkPart } from '../../../../../types/claim/claimWorkPart';

import Button from '../../../../../ui/Button';
import ConfirmBox from '../../../../../ui/ConfirmBox';
import InputField from '../../../../../ui/InputField';
import Modal from '../../../../../ui/Modal/Modal';
import ModalFooter from '../../../../../ui/Modal/ModalFooter';
import Select from '../../../../../ui/Select';
import { Table, TableToolbar, type TableColumnDef } from '../../../../../ui/Table';
import { inputBase } from '../../../../../ui/formStyles';
import {
    formatPartQuantity,
    getPartQuantityError,
    getPartQuantityMin,
    getPartQuantityStep,
    normalizePartQuantityInput,
    parsePartQuantityInput,
} from '../../../../../utils/formats/partQuantityFormat';

interface Props {
    claimWork: ClaimWork;
    repairWorkName: string;
    canManage: boolean;
    employeeId: number | null;
    onClose: () => void;
    onChanged?: () => Promise<void> | void;
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
        () => parsePartQuantityInput(quantity),
        [quantity],
    );

    const quantityError = submitted
        ? getPartQuantityError(parsedQuantity, {
            unitType: selectedPart?.unitType,
            unitName: selectedPart?.unitName,
            max: selectedPart?.stockQuantity,
            requiredMessage: 'Вкажіть коректну кількість більше 0',
        })
        : undefined;

    const selectedPartError = submitted && selectedPartId == null
        ? 'Запчастина обовʼязкова'
        : undefined;

    const canSubmitCreate =
        canManage &&
        employeeId != null &&
        selectedPartId != null &&
        !getPartQuantityError(parsedQuantity, {
            unitType: selectedPart?.unitType,
            unitName: selectedPart?.unitName,
            max: selectedPart?.stockQuantity,
            requiredMessage: 'Вкажіть коректну кількість більше 0',
        });

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

        const parsed = parsePartQuantityInput(editingQuantity);
        const catalogPart = partById.get(item.partId);
        const maxQuantity = catalogPart
            ? catalogPart.stockQuantity + item.quantity
            : undefined;
        const error = getPartQuantityError(parsed, {
            unitType: catalogPart?.unitType,
            unitName: catalogPart?.unitName,
            max: maxQuantity,
            requiredMessage: 'Вкажіть коректну кількість більше 0',
        });

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
                const parsedEditingQuantity = parsePartQuantityInput(editingQuantity);
                const editMaxQuantity = catalogPart
                    ? catalogPart.stockQuantity + item.quantity
                    : undefined;
                const editError = editingSubmitted && isEditing
                    ? getPartQuantityError(parsedEditingQuantity, {
                        unitType: catalogPart?.unitType,
                        unitName: catalogPart?.unitName,
                        max: editMaxQuantity,
                        requiredMessage: 'Вкажіть коректну кількість більше 0',
                    })
                    : undefined;

                if (!isEditing) {
                    return (
                        <span className="font-mono">
                            {formatPartQuantity(item.quantity, item.unitName)}
                        </span>
                    );
                }

                return (
                    <div className="ml-auto max-w-32 space-y-1">
                        <input
                            type="number"
                            min={getPartQuantityMin(catalogPart?.unitType)}
                            step={getPartQuantityStep(catalogPart?.unitType)}
                            value={editingQuantity}
                            onChange={event => setEditingQuantity(
                                normalizePartQuantityInput(event.target.value, catalogPart?.unitType),
                            )}
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
                                                {part.partCode} · {formatPartQuantity(part.stockQuantity, part.unitName)}
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
                                    ? `Склад: ${formatPartQuantity(selectedPart.stockQuantity, selectedPart.unitName)}`
                                    : undefined
                                }
                            >
                                <input
                                    type="number"
                                    min={getPartQuantityMin(selectedPart?.unitType)}
                                    step={getPartQuantityStep(selectedPart?.unitType)}
                                    value={quantity}
                                    onChange={event => setQuantity(
                                        normalizePartQuantityInput(event.target.value, selectedPart?.unitType),
                                    )}
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
                    description={`${deleteItem.partName} (${formatPartQuantity(deleteItem.quantity, deleteItem.unitName)})`}
                    confirmText="Видалити"
                    confirmVariant="danger"
                    onConfirm={() => void handleDelete()}
                    onCancel={() => setDeleteItem(null)}
                />
            )}
        </>
    );
}
