import { useState } from 'react';

import type { ComplexityLevel } from '../../../types/diagnosis/DSS/complexityLevel';
import type { UpdateComplexityLevelPayload } from '../../../types/diagnosis/DSS/complexityLevelPayloads';

import Button from '../../../ui/Button';
import FormField from '../../../ui/FormField';
import Modal from '../../../ui/Modal/Modal';
import ModalFooter from '../../../ui/Modal/ModalFooter';
import { inputBase } from '../../../ui/formStyles';

interface Props {
    level: ComplexityLevel;
    updating: boolean;
    onClose: () => void;
    onSave: (payload: UpdateComplexityLevelPayload) => Promise<void>;
}

export default function EditComplexityLevelModal({
    level,
    updating,
    onClose,
    onSave,
}: Props) {
    const [form, setForm] = useState({
        name: level.name,
        description: level.description,
    });

    const canSubmit = form.name.trim() && form.description.trim();

    const handleSubmit = async () => {
        if (!canSubmit) return;

        await onSave({
            name: form.name.trim(),
            description: form.description.trim(),
        });

        onClose();
    };

    return (
        <Modal title="Редагувати рівень складності" onClose={onClose} width="lg">
            <div className="space-y-3">
                <FormField label="Назва">
                    <input
                        className={inputBase}
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                    />
                </FormField>

                <FormField label="Опис">
                    <textarea
                        className={`${inputBase} h-32 py-2`}
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
