// pages/clients/modals/CreateClientModal.tsx

import { useState } from 'react';

import type { CreateClientPayload } from '../../../types/client/clientPayloads';

import Button from '../../../ui/Button';
import FormField from '../../../ui/FormField';
import Modal from '../../../ui/Modal/Modal';
import ModalFooter from '../../../ui/Modal/ModalFooter';
import PhoneInput from '../../../ui/PhoneInput';
import { inputBase } from '../../../ui/formStyles';

import { isPhoneNumberValid } from '../../../utils/phone';

interface Props {
    creating: boolean;
    onClose: () => void;
    onCreate: (payload: CreateClientPayload) => Promise<void>;
}

export default function CreateClientModal({
    creating,
    onClose,
    onCreate,
}: Props) {
    const [form, setForm] = useState({
        organizationName: '',
        organizationEmail: '',
        organizationPhoneNumber: '',
        contactPersonName: '',
        address: '',
        notes: '',
    });

    const isPhoneValid = isPhoneNumberValid(form.organizationPhoneNumber);

    const canSubmit =
        form.organizationName.trim() &&
        form.organizationEmail.trim() &&
        isPhoneValid &&
        form.address.trim();

    const handleSubmit = async () => {
        if (!canSubmit) return;

        await onCreate({
            organizationName: form.organizationName.trim(),
            organizationEmail: form.organizationEmail.trim(),
            organizationPhoneNumber: form.organizationPhoneNumber.trim(),
            contactPersonName: form.contactPersonName.trim() || null,
            address: form.address.trim(),
            notes: form.notes.trim() || null,
        });

        onClose();
    };

    return (
        <Modal title="Додати клієнта" onClose={onClose} width="lg">
            <div className="space-y-3">
                <FormField label="Назва організації">
                    <input
                        className={inputBase}
                        value={form.organizationName}
                        onChange={e =>
                            setForm({ ...form, organizationName: e.target.value })
                        }
                    />
                </FormField>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <FormField label="Email організації">
                        <input
                            type="email"
                            className={inputBase}
                            value={form.organizationEmail}
                            onChange={e =>
                                setForm({ ...form, organizationEmail: e.target.value })
                            }
                        />
                    </FormField>

                    <FormField label="Телефон організації">
                        <PhoneInput
                            value={form.organizationPhoneNumber}
                            onChange={organizationPhoneNumber =>
                                setForm({ ...form, organizationPhoneNumber })
                            }
                            required
                            requiredErrorMessage="Телефон організації обов'язковий"
                            invalidErrorMessage="Телефон повинен бути у форматі +380 XX XXX XX XX"
                        />
                    </FormField>
                </div>

                <FormField label="Контактна особа">
                    <input
                        className={inputBase}
                        value={form.contactPersonName}
                        onChange={e =>
                            setForm({ ...form, contactPersonName: e.target.value })
                        }
                    />
                </FormField>

                <FormField label="Адреса">
                    <textarea
                        className={`${inputBase} h-24 py-2`}
                        value={form.address}
                        onChange={e =>
                            setForm({ ...form, address: e.target.value })
                        }
                    />
                </FormField>

                <FormField label="Нотатки">
                    <textarea
                        className={`${inputBase} h-28 py-2`}
                        value={form.notes}
                        onChange={e =>
                            setForm({ ...form, notes: e.target.value })
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
