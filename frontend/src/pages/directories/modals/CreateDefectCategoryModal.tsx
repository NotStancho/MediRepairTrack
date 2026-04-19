// pages/directories/modals/CreateDefectCategoryModal.tsx

import { useState } from 'react';

import type { CreateDefectCategoryPayload } from '../../../types/defectCategory/defectCategoryPayloads';

import Button from '../../../ui/Button';
import FormField from '../../../ui/FormField';
import Modal from '../../../ui/Modal/Modal';
import ModalFooter from '../../../ui/Modal/ModalFooter';
import { inputBase } from '../../../ui/formStyles';

interface Props {
    creating: boolean;
    onClose: () => void;
    onCreate: (payload: CreateDefectCategoryPayload) => Promise<void>;
}

export default function CreateDefectCategoryModal({
    creating,
    onClose,
    onCreate,
}: Props) {
    const [form, setForm] = useState({
        name: '',
        description: '',
        typicalSymptoms: '',
    });

    const canSubmit =
        form.name.trim() &&
        form.description.trim() &&
        form.typicalSymptoms.trim();

    const handleSubmit = async () => {
        if (!canSubmit) return;

        await onCreate({
            name: form.name.trim(),
            description: form.description.trim(),
            typicalSymptoms: form.typicalSymptoms.trim(),
        });

        onClose();
    };

    return (
        <Modal title="Додати категорію дефекту" onClose={onClose} width="lg">
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
                    disabled={creating || !canSubmit}
                >
                    {creating ? 'Створення...' : 'Додати'}
                </Button>
            </ModalFooter>
        </Modal>
    );
}
