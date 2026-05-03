//pages/part/modals/AddPartStockModal.tsx

import { useMemo, useState } from 'react';

import type { Part } from '../../../types/part/part';
import type { AddPartStockPayload } from '../../../types/part/partPayloads';

import Button from '../../../ui/Button';
import FormField from '../../../ui/FormField';
import Modal from '../../../ui/Modal/Modal';
import ModalFooter from '../../../ui/Modal/ModalFooter';
import { inputBase } from '../../../ui/formStyles';

import {
    formatPartQuantity,
    getPartQuantityError,
    getPartQuantityMin,
    getPartQuantityStep,
    normalizePartQuantityInput,
    parsePartQuantityInput,
} from '../../../utils/formats/partQuantityFormat';

interface Props {
    part: Part;
    adding: boolean;
    onClose: () => void;
    onSave: (payload: AddPartStockPayload) => Promise<void>;
}

export default function AddPartStockModal({
    part,
    adding,
    onClose,
    onSave,
}: Props) {
    const [quantity, setQuantity] = useState('');

    const quantityNumber = useMemo(
        () => parsePartQuantityInput(quantity),
        [quantity],
    );
    const quantityError = getPartQuantityError(quantityNumber, {
        unitType: part.unitType,
        unitName: part.unitName,
        requiredMessage: 'Вкажіть коректну кількість більше 0',
    });
    const canSubmit = !quantityError;

    const handleSubmit = async () => {
        if (!canSubmit || quantityNumber == null) return;

        await onSave({ quantity: quantityNumber });
        onClose();
    };

    return (
        <Modal title="Поповнити склад" onClose={onClose} width="md">
            <div className="space-y-4">
                <div className="rounded-xl border border-border bg-surface-muted p-4">
                    <div className="text-sm font-medium text-ink">
                        {part.partName}
                    </div>
                    <div className="mt-1 font-mono text-xs text-ink-muted">
                        {part.partCode}
                    </div>
                    <div className="mt-3 text-sm text-ink">
                        Поточний залишок: {formatPartQuantity(part.stockQuantity, part.unitName)}
                    </div>
                </div>

                <FormField label="Кількість для додавання">
                    <input
                        type="number"
                        min={getPartQuantityMin(part.unitType)}
                        step={getPartQuantityStep(part.unitType)}
                        className={inputBase}
                        value={quantity}
                        onChange={e => setQuantity(
                            normalizePartQuantityInput(e.target.value, part.unitType),
                        )}
                    />
                    {quantity.trim() && quantityError && (
                        <div className="mt-1 text-xs text-danger">
                            {quantityError}
                        </div>
                    )}
                </FormField>
            </div>

            <ModalFooter>
                <Button variant="secondary" onClick={onClose}>
                    Скасувати
                </Button>

                <Button
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={adding || !canSubmit}
                >
                    {adding ? 'Оновлення...' : 'Додати на склад'}
                </Button>
            </ModalFooter>
        </Modal>
    );
}
