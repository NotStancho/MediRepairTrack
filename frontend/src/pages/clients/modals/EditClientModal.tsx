// pages/clients/modals/EditClientModal.tsx

import { useMemo, useState } from 'react';

import type { Client } from '../../../types/client/client';
import type { UpdateClientPayload } from '../../../types/client/clientPayloads';

import Button from '../../../ui/Button';
import FormField from '../../../ui/FormField';
import Modal from '../../../ui/Modal/Modal';
import ModalFooter from '../../../ui/Modal/ModalFooter';
import { inputBase } from '../../../ui/formStyles';

const PHONE_PATTERN = /^\+380\d{9}$/;

interface Props {
    client: Client;
    updating: boolean;
    onClose: () => void;
    onSave: (payload: UpdateClientPayload) => Promise<void>;
}

export default function EditClientModal({
    client,
    updating,
    onClose,
    onSave,
}: Props) {
    const [form, setForm] = useState({
        organizationName: client.organizationName,
        organizationEmail: client.organizationEmail,
        organizationPhoneNumber: client.organizationPhoneNumber,
        contactPersonName: client.contactPersonName ?? '',
        address: client.address,
        notes: client.notes ?? '',
    });

    const isPhoneValid = useMemo(
        () => PHONE_PATTERN.test(form.organizationPhoneNumber.trim()),
        [form.organizationPhoneNumber]
    );

    const canSubmit =
        form.organizationName.trim() &&
        form.organizationEmail.trim() &&
        isPhoneValid &&
        form.address.trim();

    const handleSubmit = async () => {
        if (!canSubmit) return;

        await onSave({
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
        <Modal title="Редагувати клієнта" onClose={onClose} width="lg">
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
                        <input
                            className={inputBase}
                            placeholder="+380XXXXXXXXX"
                            value={form.organizationPhoneNumber}
                            onChange={e =>
                                setForm({ ...form, organizationPhoneNumber: e.target.value })
                            }
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
                    disabled={updating || !canSubmit}
                >
                    {updating ? 'Збереження...' : 'Зберегти'}
                </Button>
            </ModalFooter>
        </Modal>
    );
}
