// pages/directories/modals/EditDefectCategoryModal.tsx

import { useState } from 'react';

import type { DefectCategory } from '../../../types/defectCategory/defectCategory';
import type { UpdateDefectCategoryPayload } from '../../../types/defectCategory/defectCategoryPayloads';

import Button from '../../../ui/Button';
import FormField from '../../../ui/FormField';
import Modal from '../../../ui/Modal/Modal';
import ModalFooter from '../../../ui/Modal/ModalFooter';
import { inputBase } from '../../../ui/formStyles';

interface Props {
    defectCategory: DefectCategory;
    updating: boolean;
    onClose: () => void;
    onSave: (payload: UpdateDefectCategoryPayload) => Promise<void>;
}

export default function EditDefectCategoryModal({
    defectCategory,
    updating,
    onClose,
    onSave,
}: Props) {
    const [form, setForm] = useState({
        name: defectCategory.name,
        description: defectCategory.description,
        typicalSymptoms: defectCategory.typicalSymptoms,
    });

    const canSubmit =
        form.name.trim() &&
        form.description.trim() &&
        form.typicalSymptoms.trim();

    const handleSubmit = async () => {
        if (!canSubmit) return;

        await onSave({
            name: form.name.trim(),
            description: form.description.trim(),
            typicalSymptoms: form.typicalSymptoms.trim(),
        });

        onClose();
    };

    return (
        <Modal title="Редагувати категорію дефекту" onClose={onClose} width="lg">
            <div className="space-y-3">
                <FormField label="Назва">
                    <input
                        className={inputBase}
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                    />
                </FormField>

                <FormField label="Типові симптоми">
                    <textarea
                        className={`${inputBase} h-28 py-2`}
                        value={form.typicalSymptoms}
                        onChange={e =>
                            setForm({ ...form, typicalSymptoms: e.target.value })
                        }
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
