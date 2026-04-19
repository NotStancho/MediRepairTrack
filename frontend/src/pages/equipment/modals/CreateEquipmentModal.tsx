// pages/equipment/modals/CreateEquipmentModal.tsx

import { useState } from 'react';

import Modal from '../../../ui/Modal/Modal';
import ModalFooter from '../../../ui/Modal/ModalFooter';
import Button from '../../../ui/Button';
import FormField from '../../../ui/FormField';
import Select from '../../../ui/Select';
import { inputBase } from '../../../ui/formStyles';

import type { EquipmentModelShort } from '../../../types/equipmentModel/equipmentModelShort';
import type { CreateEquipmentPayload } from '../../../types/equipment/equipmentPayloads';

interface Props {
    models: EquipmentModelShort[];
    creating: boolean;
    onClose: () => void;
    onCreate: (payload: CreateEquipmentPayload) => Promise<void>;
}

export default function CreateEquipmentModal({
                                                 models,
                                                 creating,
                                                 onClose,
                                                 onCreate,
                                             }: Props) {

    const [form, setForm] = useState({
        modelId: null as number | null,
        serialNumber: '',
        purchaseDate: '',
        price: '',
        description: '',
    });

    const handleSubmit = async () => {
        await onCreate({
            modelId: form.modelId as number,
            serialNumber: form.serialNumber.trim(),
            purchaseDate: form.purchaseDate,
            price: Number(form.price),
            description: form.description || null,
        });

        onClose();
    };

    return (
        <Modal title="Додати обладнання" onClose={onClose} width="lg">
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
                    disabled={creating}
                >
                    {creating ? 'Створення...' : 'Додати'}
                </Button>
            </ModalFooter>
        </Modal>
    );
}