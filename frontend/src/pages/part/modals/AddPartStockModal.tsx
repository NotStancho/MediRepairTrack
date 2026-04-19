//pages/part/modals/AddPartStockModal.tsx

import { useMemo, useState } from 'react';

import type { Part } from '../../../types/part/part';
import type { AddPartStockPayload } from '../../../types/part/partPayloads';

import Button from '../../../ui/Button';
import FormField from '../../../ui/FormField';
import Modal from '../../../ui/Modal/Modal';
import ModalFooter from '../../../ui/Modal/ModalFooter';
import { inputBase } from '../../../ui/formStyles';

import { formatPartQuantity } from '../../../utils/formats/partQuantityFormat';

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

    const quantityNumber = Number(quantity);
    const isPiece = part.unitType === 'PIECE';

    const canSubmit = useMemo(() => {
        if (!quantity.trim()) return false;
        if (Number.isNaN(quantityNumber) || quantityNumber <= 0) return false;
        if (isPiece && !Number.isInteger(quantityNumber)) return false;
        return true;
    }, [isPiece, quantity, quantityNumber]);

    const handleSubmit = async () => {
        if (!canSubmit) return;

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
                        min={isPiece ? '1' : '0.001'}
                        step={isPiece ? '1' : '0.001'}
                        className={inputBase}
                        value={quantity}
                        onChange={e => setQuantity(e.target.value)}
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
                    disabled={adding || !canSubmit}
                >
                    {adding ? 'Оновлення...' : 'Додати на склад'}
                </Button>
            </ModalFooter>
        </Modal>
    );
}
