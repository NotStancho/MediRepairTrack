// pages/equipment/modals/EditEquipmentModelModal.tsx

import { useState } from 'react';

import Modal from '../../../ui/Modal/Modal';
import ModalFooter from '../../../ui/Modal/ModalFooter';
import Button from '../../../ui/Button';
import FormField from '../../../ui/FormField';
import Select from '../../../ui/Select';
import { inputBase } from '../../../ui/formStyles';

import type { EquipmentModel } from '../../../types/equipmentModel/equipmentModel';
import type { UpdateEquipmentModelPayload } from '../../../types/equipmentModel/equipmentModelPayloads';

import { EQUIPMENT_TYPE_OPTIONS, getEquipmentTypeLabel } from '../../../utils/equipmentLabel';
import EquipmentTypeBadge from '../../../components/badges/EquipmentTypeBadge';

interface Props {
    model: EquipmentModel;
    updating: boolean;
    onClose: () => void;
    onSave: (payload: UpdateEquipmentModelPayload) => Promise<void>;
}

export default function EditEquipmentModelModal({
                                                    model,
                                                    updating,
                                                    onClose,
                                                    onSave,
                                                }: Props) {
    const [form, setForm] = useState({
        modelName: model.modelName,
        manufacturer: model.manufacturer,
        type: model.type,
        releaseDate: model.releaseDate,
        description: model.description ?? '',
    });

    const handleSubmit = async () => {
        await onSave({
            modelName: form.modelName.trim(),
            manufacturer: form.manufacturer.trim(),
            type: form.type,
            releaseDate: form.releaseDate,
            description: form.description || null,
        });

        onClose();
    };

    return (
        <Modal title="Редагувати модель обладнання" onClose={onClose} width="lg">
            <div className="space-y-3">
                <FormField label="Назва моделі">
                    <input
                        className={inputBase}
                        value={form.modelName}
                        onChange={(e) => setForm({ ...form, modelName: e.target.value })}
                    />
                </FormField>

                <FormField label="Виробник">
                    <input
                        className={inputBase}
                        value={form.manufacturer}
                        onChange={(e) => setForm({ ...form, manufacturer: e.target.value })}
                    />
                </FormField>

                <div className="grid grid-cols-2 gap-2">
                    <FormField label="Тип обладнання">
                        <Select
                            value={form.type}
                            onChange={(val) => setForm({...form, type: val})}
                            options={EQUIPMENT_TYPE_OPTIONS}
                            getLabel={getEquipmentTypeLabel}
                            getValue={(item) => item}

                            renderOption={(item, { selected }) => (
                                <div className="flex items-center gap-2">
                                    <EquipmentTypeBadge type={item} shape="rounded" />
                                    {selected && <span className="text-xs text-ink-muted">✓</span>}
                                </div>
                            )}
                            renderValue={(item) =>
                                item ? (
                                    <EquipmentTypeBadge type={item} shape="rounded" />
                                ) : (
                                    <span className="text-ink-muted">Оберіть тип</span>
                                )
                            }
                        />
                    </FormField>

                    <FormField label="Дата випуску">
                        <input
                            type="date"
                            className={inputBase}
                            value={form.releaseDate}
                            onChange={(e) => setForm({ ...form, releaseDate: e.target.value })}
                        />
                    </FormField>
                </div>

                <FormField label="Опис">
                    <textarea
                        className={inputBase}
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
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
                    disabled={updating}
                >
                    {updating ? 'Збереження...' : 'Зберегти'}
                </Button>
            </ModalFooter>
        </Modal>
    );
}
