// pages/equipment/modals/EditEquipmentModal.tsx

import { useState } from 'react';

import Modal from '../../../ui/Modal/Modal';
import ModalFooter from '../../../ui/Modal/ModalFooter';
import Button from '../../../ui/Button';
import FormField from '../../../ui/FormField';
import Select from '../../../ui/Select';
import { inputBase } from '../../../ui/formStyles';

import type { Equipment } from '../../../types/equipment/equipment';
import type { EquipmentModelShort } from '../../../types/equipmentModel/equipmentModelShort';
import type { UpdateEquipmentPayload } from '../../../types/equipment/equipmentPayloads';

interface Props {
    equipment: Equipment;
    models: EquipmentModelShort[];
    updating: boolean;
    onClose: () => void;
    onSave: (payload: UpdateEquipmentPayload) => Promise<void>;
}

export default function EditEquipmentModal({
                                               equipment,
                                               models,
                                               updating,
                                               onClose,
                                               onSave,
                                           }: Props) {

    const [form, setForm] = useState({
        modelId: equipment.model.id,
        serialNumber: equipment.serialNumber,
        purchaseDate: equipment.purchaseDate,
        price: equipment.price.toString(),
        description: equipment.description ?? '',
    });

    const handleSubmit = async () => {
        await onSave({
            modelId: form.modelId,
            serialNumber: form.serialNumber,
            purchaseDate: form.purchaseDate,
            price: Number(form.price),
            description: form.description || null,
        });

        onClose();
    };

    return (
        <Modal title="Редагувати обладнання" onClose={onClose} width="lg">
            <div className="space-y-3">

                <FormField label="Модель">
                    <Select
                        value={form.modelId}
                        onChange={(val) => setForm({ ...form, modelId: val })}
                        options={models}
                        getLabel={(m) => `${m.modelName} (${m.manufacturer})`}
                        getValue={(m) => m.id}
                        searchable
                    />
                </FormField>

                <FormField label="Серійний номер">
                    <input
                        className={inputBase}
                        value={form.serialNumber}
                        onChange={(e) =>
                            setForm({ ...form, serialNumber: e.target.value })
                        }
                    />
                </FormField>

                <div className="grid grid-cols-2 gap-2">
                    <FormField label="Дата купівлі">
                        <input
                            type="date"
                            className={inputBase}
                            value={form.purchaseDate}
                            onChange={(e) =>
                                setForm({ ...form, purchaseDate: e.target.value })
                            }
                        />
                    </FormField>

                    <FormField label="Ціна">
                        <input
                            type="number"
                            step="0.01"
                            className={inputBase}
                            value={form.price}
                            onChange={(e) =>
                                setForm({ ...form, price: e.target.value })
                            }
                        />
                    </FormField>
                </div>

                <FormField label="Опис">
                    <textarea
                        className={inputBase}
                        value={form.description}
                        onChange={(e) =>
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
                    disabled={updating}
                >
                    {updating ? 'Збереження...' : 'Зберегти'}
                </Button>
            </ModalFooter>
        </Modal>
    );
}