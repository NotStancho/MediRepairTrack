// components/claims/tabs/ClaimDiagnosisTab/modals/PredictedWorkPartsModal

import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';

import { usePredictedWorkParts } from '../../../../../hooks/diagnosis/usePredictedWorkParts';

import type { PredictedWorkPart } from '../../../../../types/diagnosis/DSS/predictedWorkPart';

import Button from '../../../../../ui/Button';
import ConfirmBox from '../../../../../ui/ConfirmBox';
import InputField from '../../../../../ui/InputField';
import Modal from '../../../../../ui/Modal/Modal';
import ModalFooter from '../../../../../ui/Modal/ModalFooter';
import Select from '../../../../../ui/Select';
import { Table, TableToolbar, type TableColumnDef } from '../../../../../ui/Table';
import { inputBase } from '../../../../../ui/formStyles';

import { formatMoney } from '../../../../../utils/formats/moneyFormat';
import {
    formatPartQuantity,
    getPartQuantityError,
    getPartQuantityMin,
    getPartQuantityStep,
    normalizePartQuantityInput,
    parsePartQuantityInput,
} from '../../../../../utils/formats/partQuantityFormat';

interface Props {
    predictionId: number;
    repairWorkId: number;
    repairWorkName: string;
    onClose: () => void;
    onChanged?: () => Promise<void> | void;
}

function parseProbabilityInput(value: string) {
    const normalized = value.replace(',', '.').trim();

    if (!normalized) {
        return null;
    }

    const parsed = Number(normalized);

    return Number.isFinite(parsed) ? parsed : null;
}

function normalizeProbabilityInput(value: string) {
    const sanitized = value.replace(',', '.').replace(/[^\d.]/g, '');
    const [integerPart, ...fractionParts] = sanitized.split('.');

    if (fractionParts.length === 0) {
        return integerPart.slice(0, 1);
    }

    return `${integerPart.slice(0, 1)}.${fractionParts.join('').slice(0, 4)}`;
}

function getProbabilityError(value: number | null) {
    if (value == null) {
        return 'Вкажіть ймовірність';
    }

    if (value < 0 || value > 1) {
        return 'Ймовірність має бути від 0 до 1';
    }

    return undefined;
}

function formatPercent(value: number) {
    return `${(value * 100).toFixed(1)}%`;
}

export default function PredictedWorkPartsModal({
    predictionId,
    repairWorkId,
    repairWorkName,
    onClose,
    onChanged,
}: Props) {
    const {
        data: items,
        available,
        loading,

        creating,
        updating,
        removing,

        create,
        update,
        remove,
    } = usePredictedWorkParts(predictionId, repairWorkId);

    const [selectedPartId, setSelectedPartId] = useState<number | null>(null);
    const [quantity, setQuantity] = useState('');
    const [probability, setProbability] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const [editingPartId, setEditingPartId] = useState<number | null>(null);
    const [editingQuantity, setEditingQuantity] = useState('');
    const [editingProbability, setEditingProbability] = useState('');
    const [editingSubmitted, setEditingSubmitted] = useState(false);
    const [deleteItem, setDeleteItem] = useState<PredictedWorkPart | null>(null);

    const partById = useMemo(
        () => new Map(available.map(part => [part.id, part])),
        [available],
    );

    const selectedPart = selectedPartId != null
        ? partById.get(selectedPartId)
        : undefined;

    const parsedQuantity = useMemo(
        () => parsePartQuantityInput(quantity),
        [quantity],
    );
    const parsedProbability = useMemo(
        () => parseProbabilityInput(probability),
        [probability],
    );

    const quantityError = submitted
        ? getPartQuantityError(parsedQuantity, {
            unitType: selectedPart?.unitType,
            unitName: selectedPart?.unitName,
            requiredMessage: 'Вкажіть коректну кількість більше 0',
        })
        : undefined;
    const probabilityError = submitted
        ? getProbabilityError(parsedProbability)
        : undefined;
    const selectedPartError = submitted && selectedPartId == null
        ? 'Запчастина обовʼязкова'
        : undefined;

    const canSubmitCreate =
        selectedPartId != null &&
        !getPartQuantityError(parsedQuantity, {
            unitType: selectedPart?.unitType,
            unitName: selectedPart?.unitName,
            requiredMessage: 'Вкажіть коректну кількість більше 0',
        }) &&
        !getProbabilityError(parsedProbability);

    const handleCreate = async () => {
        setSubmitted(true);

        if (!canSubmitCreate || selectedPartId == null || parsedQuantity == null || parsedProbability == null) {
            return;
        }

        await create({
            predictionId,
            repairWorkId,
            partId: selectedPartId,
            predictedQuantity: parsedQuantity,
            probabilityScore: parsedProbability,
        });
        await onChanged?.();

        setSelectedPartId(null);
        setQuantity('');
        setProbability('');
        setSubmitted(false);
        toast.success('Прогнозовану запчастину додано');
    };

    const startEdit = (item: PredictedWorkPart) => {
        setEditingPartId(item.part.id);
        setEditingQuantity(String(item.predictedQuantity));
        setEditingProbability(String(item.probabilityScore));
        setEditingSubmitted(false);
    };

    const cancelEdit = () => {
        setEditingPartId(null);
        setEditingQuantity('');
        setEditingProbability('');
        setEditingSubmitted(false);
    };

    const handleUpdate = async (item: PredictedWorkPart) => {
        setEditingSubmitted(true);

        const parsedEditingQuantity = parsePartQuantityInput(editingQuantity);
        const parsedEditingProbability = parseProbabilityInput(editingProbability);
        const editQuantityError = getPartQuantityError(parsedEditingQuantity, {
            unitType: item.part.unitType,
            unitName: item.part.unitName,
            requiredMessage: 'Вкажіть коректну кількість більше 0',
        });
        const editProbabilityError = getProbabilityError(parsedEditingProbability);

        if (
            editQuantityError ||
            editProbabilityError ||
            parsedEditingQuantity == null ||
            parsedEditingProbability == null
        ) {
            return;
        }

        await update(repairWorkId, item.part.id, {
            predictedQuantity: parsedEditingQuantity,
            probabilityScore: parsedEditingProbability,
        });
        await onChanged?.();

        cancelEdit();
        toast.success('Прогнозовану запчастину оновлено');
    };

    const handleDelete = async () => {
        if (!deleteItem) {
            return;
        }

        await remove(repairWorkId, deleteItem.part.id);
        await onChanged?.();

        toast.success('Прогнозовану запчастину видалено');
        setDeleteItem(null);
    };

    const columns: TableColumnDef<PredictedWorkPart>[] = [
        {
            id: 'partName',
            header: 'Запчастина',
            accessorFn: row => `${row.part.partName} ${row.part.partCode}`,
            cell: ({ row }) => (
                <div className="min-w-0">
                    <div className="truncate font-medium text-ink">
                        {row.original.part.partName}
                    </div>
                    <div className="truncate text-xs text-ink-muted">
                        {row.original.part.partCode}
                    </div>
                </div>
            ),
        },
        {
            id: 'quantity',
            header: 'Кількість',
            accessorFn: row => formatPartQuantity(row.predictedQuantity, row.part.unitName),
            meta: { align: 'right' },
            cell: ({ row }) => {
                const item = row.original;
                const isEditing = editingPartId === item.part.id;
                const parsedEditingQuantity = parsePartQuantityInput(editingQuantity);
                const editError = editingSubmitted && isEditing
                    ? getPartQuantityError(parsedEditingQuantity, {
                        unitType: item.part.unitType,
                        unitName: item.part.unitName,
                        requiredMessage: 'Вкажіть коректну кількість більше 0',
                    })
                    : undefined;

                if (!isEditing) {
                    return (
                        <span className="font-mono">
                            {formatPartQuantity(item.predictedQuantity, item.part.unitName)}
                        </span>
                    );
                }

                return (
                    <div className="ml-auto max-w-32 space-y-1">
                        <input
                            type="number"
                            min={getPartQuantityMin(item.part.unitType)}
                            step={getPartQuantityStep(item.part.unitType)}
                            value={editingQuantity}
                            onChange={event => setEditingQuantity(
                                normalizePartQuantityInput(event.target.value, item.part.unitType),
                            )}
                            className={`${inputBase} h-9 text-right font-mono`}
                            disabled={updating}
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
            id: 'probability',
            header: 'Ймовірність',
            accessorFn: row => row.probabilityScore,
            meta: { align: 'right' },
            cell: ({ row }) => {
                const item = row.original;
                const isEditing = editingPartId === item.part.id;
                const parsedEditingProbability = parseProbabilityInput(editingProbability);
                const editError = editingSubmitted && isEditing
                    ? getProbabilityError(parsedEditingProbability)
                    : undefined;

                if (!isEditing) {
                    return (
                        <span className="font-mono">
                            {formatPercent(item.probabilityScore)}
                        </span>
                    );
                }

                return (
                    <div className="ml-auto max-w-28 space-y-1">
                        <input
                            type="number"
                            min="0"
                            max="1"
                            step="0.01"
                            value={editingProbability}
                            onChange={event => setEditingProbability(
                                normalizeProbabilityInput(event.target.value),
                            )}
                            className={`${inputBase} h-9 text-right font-mono`}
                            disabled={updating}
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
            id: 'price',
            header: 'Ціна',
            accessorFn: row => row.part.price ?? 0,
            meta: { align: 'right' },
            cell: ({ row }) => (
                <span className="font-mono">
                    {formatMoney(row.original.part.price)} ₴
                </span>
            ),
        },
        {
            id: 'rank',
            header: 'Позиція',
            accessorFn: row => row.rankPosition ?? 0,
            meta: { align: 'right' },
            cell: ({ row }) => (
                <span className="font-mono">
                    {row.original.rankPosition ?? '—'}
                </span>
            ),
        },
        {
            id: 'actions',
            header: 'Дії',
            enableSorting: false,
            enableGlobalFilter: false,
            meta: { align: 'right', headerClassName: 'w-36' },
            cell: ({ row }) => {
                const item = row.original;
                const isEditing = editingPartId === item.part.id;

                if (isEditing) {
                    return (
                        <div className="flex justify-end gap-2 text-xs">
                            <button
                                type="button"
                                className="font-medium text-brand hover:text-brand-strong disabled:text-ink-muted"
                                disabled={updating}
                                onClick={() => void handleUpdate(item)}
                            >
                                Зберегти
                            </button>
                            <button
                                type="button"
                                className="font-medium text-ink-muted hover:text-ink"
                                disabled={updating}
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
                            disabled={removing}
                            onClick={() => startEdit(item)}
                        >
                            Змінити
                        </button>
                        <button
                            type="button"
                            className="font-medium text-danger hover:text-danger-strong disabled:text-ink-muted"
                            disabled={removing}
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
                title={`Прогнозовані запчастини: ${repairWorkName}`}
                onClose={onClose}
                width="xl"
            >
                <div className="space-y-5">
                    <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_8rem_8rem_auto] md:items-end">
                        <InputField
                            label="Запчастина"
                            required
                            showRequired={submitted && selectedPartId == null}
                            error={selectedPartError}
                            helperText={!loading && available.length === 0
                                ? 'Усі доступні запчастини вже додано до цієї прогнозованої роботи'
                                : undefined
                            }
                        >
                            <Select
                                value={selectedPartId}
                                onChange={setSelectedPartId}
                                options={available}
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
                                loading={loading}
                                loadingText="Завантаження запчастин…"
                                disabled={creating || (!loading && available.length === 0)}
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

                        <InputField
                            label="Ймовірність"
                            required
                            showRequired={!!probabilityError}
                            error={probabilityError}
                        >
                            <input
                                type="number"
                                min="0"
                                max="1"
                                step="0.01"
                                value={probability}
                                onChange={event => setProbability(
                                    normalizeProbabilityInput(event.target.value),
                                )}
                                className={`${inputBase} font-mono`}
                                disabled={creating}
                            />
                        </InputField>

                        <Button
                            variant="primary"
                            onClick={handleCreate}
                            disabled={creating || loading}
                        >
                            {creating ? 'Додавання…' : 'Додати'}
                        </Button>
                    </div>

                    <Table
                        data={items}
                        columns={columns}
                        loading={loading}
                        density="compact"
                        storageKey={`prediction-work-parts-${predictionId}-${repairWorkId}`}
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
                                Немає прогнозованих запчастин
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
                    title="Видалити прогнозовану запчастину?"
                    description={`${deleteItem.part.partName} (${formatPartQuantity(deleteItem.predictedQuantity, deleteItem.part.unitName)})`}
                    confirmText={removing ? 'Видалення…' : 'Видалити'}
                    confirmVariant="danger"
                    onConfirm={() => void handleDelete()}
                    onCancel={() => setDeleteItem(null)}
                />
            )}
        </>
    );
}
