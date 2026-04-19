// pages/directories/modals/CreateRepairOperationModal.tsx

import { useMemo, useState } from 'react';

import type { ComplexityLevel } from '../../../types/diagnosis/DSS/complexityLevel';
import type { CreateRepairOperationPayload } from '../../../types/repairOperation/repairOperationPayloads';

import Button from '../../../ui/Button';
import FormField from '../../../ui/FormField';
import Modal from '../../../ui/Modal/Modal';
import ModalFooter from '../../../ui/Modal/ModalFooter';
import Select from '../../../ui/Select';
import { inputBase } from '../../../ui/formStyles';

interface Props {
    complexityLevels: ComplexityLevel[];
    complexityLoading: boolean;
    creating: boolean;
    onClose: () => void;
    onCreate: (payload: CreateRepairOperationPayload) => Promise<void>;
}

export default function CreateRepairOperationModal({
    complexityLevels,
    complexityLoading,
    creating,
    onClose,
    onCreate,
}: Props) {
    const [form, setForm] = useState({
        complexityLevelId: null as number | null,
        name: '',
        description: '',
    });

    const canSubmit = useMemo(
        () =>
            form.complexityLevelId != null &&
            form.name.trim() &&
            form.description.trim(),
        [form.complexityLevelId, form.description, form.name]
    );

    const handleSubmit = async () => {
        if (!canSubmit) return;

        await onCreate({
            complexityLevelId: form.complexityLevelId as number,
            name: form.name.trim(),
            description: form.description.trim(),
        });

        onClose();
    };

    return (
        <Modal title="Додати ремонтну операцію" onClose={onClose} width="lg">
            <div className="space-y-3">
                <FormField label="Рівень складності">
                    <Select
                        value={form.complexityLevelId}
                        onChange={value =>
                            setForm({ ...form, complexityLevelId: value })
                        }
                        options={complexityLevels}
                        getLabel={item => item.name}
                        getValue={item => item.id}
                        searchable
                        loading={complexityLoading}
                        renderOption={item => (
                            <div className="min-w-0 py-1">
                                <div className="font-medium text-ink">{item.name}</div>
                                <div className="text-xs text-ink-muted line-clamp-2">
                                    {item.description}
                                </div>
                            </div>
                        )}
                    />
                </FormField>

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
                    disabled={creating || !canSubmit}
                >
                    {creating ? 'Створення...' : 'Додати'}
                </Button>
            </ModalFooter>
        </Modal>
    );
}
