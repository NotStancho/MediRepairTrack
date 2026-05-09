import { useState } from 'react';

import type {
    InvoiceDetail,
    InvoiceOtherItemPayload,
} from '../../../../../types/invoice';

import Button from '../../../../../ui/Button';
import Input from '../../../../../ui/Input';
import InputField from '../../../../../ui/InputField';
import Modal from '../../../../../ui/Modal/Modal';
import ModalFooter from '../../../../../ui/Modal/ModalFooter';
import TextArea from '../../../../../ui/TextArea';

interface Props {
    item: InvoiceDetail | null;
    onClose: () => void;
    onSave: (payload: InvoiceOtherItemPayload) => Promise<void>;
}

export default function InvoiceOtherItemModal({
    item,
    onClose,
    onSave,
}: Props) {
    const [form, setForm] = useState<{
        description: string;
        quantity: number;
        unitName: string;
        pricePerUnit: number | '';
    }>({
        description: item?.description ?? '',
        quantity: item?.quantity ?? 1,
        unitName: item?.unitName ?? 'послуга',
        pricePerUnit: item?.pricePerUnit ?? '',
    });

    const handleSubmit = async () => {
        await onSave({
            ...form,
            pricePerUnit: Number(form.pricePerUnit),
        });

        onClose();
    };

    return (
        <Modal
            title={item ? 'Редагувати позицію' : 'Додати позицію'}
            onClose={onClose}
            width="md"
            backdrop="dim"
        >
            <div className="space-y-4">
                <InputField label="Опис">
                    <TextArea
                        value={form.description}
                        onChange={(event) =>
                            setForm({
                                ...form,
                                description: event.target.value,
                            })
                        }
                    />
                </InputField>

                <div className="grid grid-cols-3 gap-2">
                    <InputField label="Кількість">
                        <Input
                            type="number"
                            value={form.quantity}
                            onChange={(event) =>
                                setForm({
                                    ...form,
                                    quantity: +event.target.value,
                                })
                            }
                        />
                    </InputField>

                    <InputField label="Одиниця">
                        <Input
                            value={form.unitName}
                            onChange={(event) =>
                                setForm({
                                    ...form,
                                    unitName: event.target.value,
                                })
                            }
                        />
                    </InputField>

                    <InputField label="Ціна">
                        <Input
                            type="number"
                            value={form.pricePerUnit}
                            onChange={(event) =>
                                setForm({
                                    ...form,
                                    pricePerUnit:
                                        event.target.value === ''
                                            ? ''
                                            : +event.target.value,
                                })
                            }
                        />
                    </InputField>
                </div>
            </div>

            <ModalFooter>
                <Button variant="secondary" onClick={onClose}>
                    Скасувати
                </Button>

                <Button variant="primary" onClick={handleSubmit}>
                    {item ? 'Зберегти' : 'Додати'}
                </Button>
            </ModalFooter>
        </Modal>
    );
}
