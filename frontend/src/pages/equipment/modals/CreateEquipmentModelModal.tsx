// pages/equipment/modals/CreateEquipmentModelModal.tsx

import { useState } from 'react';

import Modal from '../../../ui/Modal/Modal';
import ModalFooter from '../../../ui/Modal/ModalFooter';
import Button from '../../../ui/Button';
import FormField from '../../../ui/FormField';
import Select from '../../../ui/Select';
import { inputBase } from '../../../ui/formStyles';

import { EQUIPMENT_TYPE_OPTIONS, getEquipmentTypeLabel } from '../../../utils/equipmentLabel';

import type { EquipmentType } from '../../../types/equipmentModel/equipmentType';
import type { CreateEquipmentModelPayload } from '../../../types/equipmentModel/equipmentModelPayloads';
import EquipmentTypeBadge from '../../../components/badges/EquipmentTypeBadge';

interface Props {
    creating: boolean;
    onClose: () => void;
    onCreate: (payload: CreateEquipmentModelPayload) => Promise<void>;
}

export default function CreateEquipmentModelModal({
                                                      creating,
                                                      onClose,
                                                      onCreate,
                                                  }: Props) {
    const [form, setForm] = useState({
        modelName: '',
        manufacturer: '',
        type: null as EquipmentType | null,
        releaseDate: '',
        description: '',
    });

    const handleSubmit = async () => {
        await onCreate({
            modelName: form.modelName.trim(),
            manufacturer: form.manufacturer.trim(),
            type: form.type as EquipmentType,
            releaseDate: form.releaseDate,
            description: form.description || null,
        });

        onClose();
    };

    return (
        <Modal title="Додати модель обладнання" onClose={onClose} width="lg">
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
                    disabled={creating}
                >
                    {creating ? 'Створення...' : 'Додати'}
                </Button>
            </ModalFooter>
        </Modal>
    );
}
