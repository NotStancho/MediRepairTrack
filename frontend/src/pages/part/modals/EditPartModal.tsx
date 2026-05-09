//pages/part/modals/EditPartModal.tsx

import { useMemo, useState } from 'react';

import type { Part } from '../../../types/part/part';
import type { UpdatePartPayload } from '../../../types/part/partPayloads';
import type { PartUnitType } from '../../../types/part/partUnitType';

import Button from '../../../ui/Button';
import FormField from '../../../ui/FormField';
import Modal from '../../../ui/Modal/Modal';
import ModalFooter from '../../../ui/Modal/ModalFooter';
import Select from '../../../ui/Select';
import { inputBase } from '../../../ui/formStyles';

import { formatPartQuantity } from '../../../utils/formats/partQuantityFormat';
import {
    PART_UNIT_TYPE_OPTIONS,
    getPartUnitTypeLabel,
} from '../../../utils/partLabel';
import PartUnitTypeBadge from '../../../components/badges/PartUnitTypeBadge';

interface Props {
    part: Part;
    updating: boolean;
    onClose: () => void;
    onSave: (payload: UpdatePartPayload) => Promise<void>;
}

export default function EditPartModal({
    part,
    updating,
    onClose,
    onSave,
}: Props) {
    const [form, setForm] = useState({
        supplierName: part.supplierName,
        partName: part.partName,
        price: part.price.toString(),
        unitName: part.unitName,
        unitType: part.unitType as PartUnitType,
        description: part.description ?? '',
    });

    const priceNumber = Number(form.price);

    const priceIsValid = useMemo(
        () => form.price.trim() !== '' && !Number.isNaN(priceNumber) && priceNumber > 0,
        [form.price, priceNumber]
    );

    const canSubmit =
        form.supplierName.trim() &&
        form.partName.trim() &&
        form.unitName.trim() &&
        form.unitType &&
        priceIsValid;

    const handleSubmit = async () => {
        if (!canSubmit) return;

        await onSave({
            supplierName: form.supplierName.trim(),
            partName: form.partName.trim(),
            price: priceNumber,
            unitName: form.unitName.trim(),
            unitType: form.unitType,
            description: form.description.trim() || null,
        });

        onClose();
    };

    return (
        <Modal title="Редагувати запчастину" onClose={onClose} width="lg">
            <div className="space-y-4">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div className="rounded-xl border border-border bg-surface-muted p-4">
                        <div className="text-xs font-medium uppercase tracking-wide text-ink-muted">
                            Код запчастини
                        </div>
                        <div className="mt-2 font-mono text-sm text-ink">
                            {part.partCode}
                        </div>
                    </div>

                    <div className="rounded-xl border border-border bg-surface-muted p-4">
                        <div className="text-xs font-medium uppercase tracking-wide text-ink-muted">
                            Поточний залишок
                        </div>
                        <div className="mt-2 text-sm text-ink">
                            {formatPartQuantity(part.stockQuantity, part.unitName)}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <FormField label="Назва запчастини">
                        <input
                            className={inputBase}
                            value={form.partName}
                            onChange={e =>
                                setForm({ ...form, partName: e.target.value })
                            }
                        />
                    </FormField>

                    <FormField label="Постачальник">
                        <input
                            className={inputBase}
                            value={form.supplierName}
                            onChange={e =>
                                setForm({ ...form, supplierName: e.target.value })
                            }
                        />
                    </FormField>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <FormField label="Одиниця виміру">
                        <input
                            className={inputBase}
                            value={form.unitName}
                            onChange={e =>
                                setForm({ ...form, unitName: e.target.value })
                            }
                        />
                    </FormField>

                    <FormField label="Тип одиниці">
                        <Select
                            value={form.unitType}
                            onChange={value =>
                                setForm({ ...form, unitType: value })
                            }
                            options={PART_UNIT_TYPE_OPTIONS}
                            getLabel={item => getPartUnitTypeLabel(item)}
                            getValue={item => item}
                            renderOption={item => (
                                <PartUnitTypeBadge type={item} />
                            )}
                            renderValue={item => (
                                <PartUnitTypeBadge type={item} />
                            )}
                        />
                    </FormField>
                </div>

                <FormField label="Ціна">
                    <input
                        type="number"
                        min="0.01"
                        step="0.01"
                        className={inputBase}
                        value={form.price}
                        onChange={e =>
                            setForm({ ...form, price: e.target.value })
                        }
                    />
                </FormField>

                <FormField label="Опис">
                    <textarea
                        className={inputBase}
                        value={form.description}
                        onChange={e =>
                            setForm({ ...form, description: e.target.value })
                        }
                    />
                </FormField>
            </div>

            <ModalFooter>
                <Button variant="secondary" onClick={onClose}>
                    Скасувати
                </Button>

                <Button
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={updating || !canSubmit}
                >
                    {updating ? 'Збереження...' : 'Зберегти'}
                </Button>
            </ModalFooter>
        </Modal>
    );
}
