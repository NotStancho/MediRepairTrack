//pages/part/modals/CreatePartModal.tsx

import { useMemo, useState } from 'react';

import type { CreatePartPayload } from '../../../types/part/partPayloads';
import type { PartUnitType } from '../../../types/part/partUnitType';

import Button from '../../../ui/Button';
import FormField from '../../../ui/FormField';
import Modal from '../../../ui/Modal/Modal';
import ModalFooter from '../../../ui/Modal/ModalFooter';
import Select from '../../../ui/Select';
import { inputBase } from '../../../ui/formStyles';

import {
    PART_UNIT_TYPE_OPTIONS,
    getPartUnitTypeLabel,
} from '../../../utils/partLabel';
import PartUnitTypeBadge from '../../../components/badges/PartUnitTypeBadge';
import {
    getPartQuantityError,
    getPartQuantityMin,
    getPartQuantityStep,
    normalizePartQuantityInput,
    parsePartQuantityInput,
} from '../../../utils/formats/partQuantityFormat';

interface Props {
    creating: boolean;
    onClose: () => void;
    onCreate: (payload: CreatePartPayload) => Promise<void>;
}

export default function CreatePartModal({
    creating,
    onClose,
    onCreate,
}: Props) {
    const [form, setForm] = useState({
        supplierName: '',
        partCode: '',
        partName: '',
        stockQuantity: '',
        price: '',
        unitName: '',
        unitType: null as PartUnitType | null,
        description: '',
    });

    const stockNumber = useMemo(
        () => parsePartQuantityInput(form.stockQuantity),
        [form.stockQuantity],
    );
    const priceNumber = Number(form.price);

    const stockError = useMemo(
        () => getPartQuantityError(stockNumber, {
            unitType: form.unitType,
            unitName: form.unitName,
            allowZero: true,
            requiredMessage: 'Вкажіть коректний залишок на складі',
        }),
        [form.unitName, form.unitType, stockNumber],
    );

    const priceIsValid = form.price.trim() !== '' && !Number.isNaN(priceNumber) && priceNumber > 0;

    const canSubmit =
        form.supplierName.trim() &&
        form.partCode.trim() &&
        form.partName.trim() &&
        form.unitName.trim() &&
        form.unitType &&
        !stockError &&
        priceIsValid;

    const handleSubmit = async () => {
        if (!canSubmit || stockNumber == null || form.unitType == null) return;

        await onCreate({
            supplierName: form.supplierName.trim(),
            partCode: form.partCode.trim(),
            partName: form.partName.trim(),
            stockQuantity: stockNumber,
            price: priceNumber,
            unitName: form.unitName.trim(),
            unitType: form.unitType,
            description: form.description.trim() || null,
        });

        onClose();
    };

    return (
        <Modal title="Додати запчастину" onClose={onClose} width="lg">
            <div className="space-y-3">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <FormField label="Код запчастини">
                        <input
                            className={inputBase}
                            value={form.partCode}
                            onChange={e =>
                                setForm({ ...form, partCode: e.target.value })
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

                <FormField label="Назва запчастини">
                    <input
                        className={inputBase}
                        value={form.partName}
                        onChange={e =>
                            setForm({ ...form, partName: e.target.value })
                        }
                    />
                </FormField>

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
                                setForm({
                                    ...form,
                                    unitType: value,
                                    stockQuantity: normalizePartQuantityInput(
                                        form.stockQuantity,
                                        value,
                                    ),
                                })
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

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <FormField label="Залишок на складі">
                        <input
                            type="number"
                            min={getPartQuantityMin(form.unitType, { allowZero: true })}
                            step={getPartQuantityStep(form.unitType)}
                            className={inputBase}
                            value={form.stockQuantity}
                            onChange={e =>
                                setForm({
                                    ...form,
                                    stockQuantity: normalizePartQuantityInput(
                                        e.target.value,
                                        form.unitType,
                                    ),
                                })
                            }
                        />
                        {form.stockQuantity.trim() && stockError && (
                            <div className="mt-1 text-xs text-danger">
                                {stockError}
                            </div>
                        )}
                    </FormField>

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
                </div>

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
                    disabled={creating || !canSubmit}
                >
                    {creating ? 'Створення...' : 'Додати'}
                </Button>
            </ModalFooter>
        </Modal>
    );
}
