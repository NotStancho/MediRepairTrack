import { useMemo, useState } from 'react';

import Button from '../../../../../ui/Button';
import Input from '../../../../../ui/Input';
import InputField from '../../../../../ui/InputField';
import Modal from '../../../../../ui/Modal/Modal';
import ModalFooter from '../../../../../ui/Modal/ModalFooter';
import { formatDateTime } from '../../../../../utils/formats/dateFormat';
import {
    DUE_DATE_EXTENSION_MAX_DAYS,
    getDueDateExtensionLimits,
    toLocalDateTimePayload,
} from '../../../../../utils/invoiceDueDate';

interface Props {
    dueAt?: string | null;
    onClose: () => void;
    onSave: (dueAt: string) => Promise<void>;
}

export default function InvoiceDueDateModal({
    dueAt,
    onClose,
    onSave,
}: Props) {
    const dueDateLimits = useMemo(
        () => getDueDateExtensionLimits(dueAt),
        [dueAt]
    );
    const [newDueAt, setNewDueAt] = useState(
        dueDateLimits?.hasAllowedRange ? dueDateLimits.min : ''
    );

    const validationError = useMemo(() => {
        if (!dueDateLimits) {
            return 'Неможливо визначити поточний термін оплати.';
        }

        if (!dueDateLimits.hasAllowedRange) {
            return 'Для цього рахунку вже немає доступних дат у межах продовження.';
        }

        if (!newDueAt) {
            return 'Оберіть новий термін оплати.';
        }

        const value = newDueAt.slice(0, 16);

        if (value < dueDateLimits.min || value > dueDateLimits.max) {
            return 'Дата має бути в дозволеному періоді.';
        }

        return '';
    }, [dueDateLimits, newDueAt]);

    const handleSubmit = async () => {
        if (validationError) return;

        await onSave(toLocalDateTimePayload(newDueAt));
        onClose();
    };

    const helperText = dueDateLimits?.hasAllowedRange
        ? `Доступний період: ${formatDateTime(dueDateLimits.min)} - ${formatDateTime(dueDateLimits.max)}. Максимум +${DUE_DATE_EXTENSION_MAX_DAYS} днів від поточного терміну.`
        : undefined;

    return (
        <Modal
            title="Продовжити термін оплати"
            onClose={onClose}
            width="sm"
        >
            <InputField
                label="Новий термін оплати"
                error={validationError || undefined}
                helperText={helperText}
            >
                <Input
                    type="datetime-local"
                    value={newDueAt}
                    min={dueDateLimits?.min}
                    max={dueDateLimits?.max}
                    disabled={!dueDateLimits?.hasAllowedRange}
                    invalid={Boolean(validationError)}
                    onChange={(event) => setNewDueAt(event.target.value)}
                />
            </InputField>

            <ModalFooter>
                <Button variant="secondary" onClick={onClose}>
                    Скасувати
                </Button>

                <Button
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={Boolean(validationError)}
                >
                    Зберегти
                </Button>
            </ModalFooter>
        </Modal>
    );
}
