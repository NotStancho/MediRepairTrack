// pages/clients/modals/CreateClientContractModal.tsx

import { useMemo, useState } from 'react';

import type { Client } from '../../../types/client/client';
import type { CreateClientContractPayload } from '../../../types/clientContract/clientContractPayloads';

import Button from '../../../ui/Button';
import FormField from '../../../ui/FormField';
import Modal from '../../../ui/Modal/Modal';
import ModalFooter from '../../../ui/Modal/ModalFooter';
import Select from '../../../ui/Select';
import { inputBase } from '../../../ui/formStyles';

import {
    CONTRACT_TYPE_COLORS,
    CONTRACT_TYPE_OPTIONS,
    getContractTypeLabel,
} from '../../../utils/clientContractLabel';

interface Props {
    clients: Client[];
    clientsLoading: boolean;
    creating: boolean;
    onClose: () => void;
    onCreate: (payload: CreateClientContractPayload) => Promise<void>;
}

function isDiscountValid(value: string) {
    if (!value.trim()) return false;
    const number = Number(value);
    return !Number.isNaN(number) && number >= 0 && number <= 100;
}

export default function CreateClientContractModal({
    clients,
    clientsLoading,
    creating,
    onClose,
    onCreate,
}: Props) {
    const [form, setForm] = useState({
        clientId: null as number | null,
        contractName: '',
        contractType: null as CreateClientContractPayload['contractType'] | null,
        validFrom: '',
        validTo: '',
        discountLabor: '0',
        discountParts: '0',
        discountDelivery: '0',
        notes: '',
    });

    const dateRangeValid = useMemo(
        () =>
            Boolean(form.validFrom && form.validTo) &&
            form.validFrom <= form.validTo,
        [form.validFrom, form.validTo]
    );

    const canSubmit = useMemo(
        () =>
            form.clientId != null &&
            form.contractName.trim() &&
            form.contractType != null &&
            dateRangeValid &&
            isDiscountValid(form.discountLabor) &&
            isDiscountValid(form.discountParts) &&
            isDiscountValid(form.discountDelivery),
        [dateRangeValid, form]
    );

    const handleSubmit = async () => {
        if (!canSubmit) return;

        await onCreate({
            clientId: form.clientId as number,
            contractName: form.contractName.trim(),
            contractType: form.contractType as CreateClientContractPayload['contractType'],
            validFrom: form.validFrom,
            validTo: form.validTo,
            discountLabor: Number(form.discountLabor),
            discountParts: Number(form.discountParts),
            discountDelivery: Number(form.discountDelivery),
            notes: form.notes.trim() || null,
        });

        onClose();
    };

    return (
        <Modal title="Додати контракт" onClose={onClose} width="lg">
            <div className="space-y-3">
                <FormField label="Клієнт">
                    <Select
                        value={form.clientId}
                        onChange={value => setForm({ ...form, clientId: value })}
                        options={clients}
                        getLabel={item => item.organizationName}
                        getValue={item => item.id}
                        searchable
                        loading={clientsLoading}
                        renderOption={item => (
                            <div className="min-w-0 py-1">
                                <div className="font-medium text-ink">
                                    {item.organizationName}
                                </div>
                                <div className="text-xs text-ink-muted line-clamp-1">
                                    {item.organizationEmail}
                                </div>
                            </div>
                        )}
                    />
                </FormField>

                <FormField label="Назва договору">
                    <input
                        className={inputBase}
                        value={form.contractName}
                        onChange={e => setForm({ ...form, contractName: e.target.value })}
                    />
                </FormField>

                <FormField label="Тип договору">
                    <Select
                        value={form.contractType}
                        onChange={value => setForm({ ...form, contractType: value })}
                        options={CONTRACT_TYPE_OPTIONS}
                        getLabel={item => getContractTypeLabel(item)}
                        getValue={item => item}
                        renderOption={item => (
                            <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ${CONTRACT_TYPE_COLORS[item]}`}>
                                {getContractTypeLabel(item)}
                            </span>
                        )}
                        renderValue={item => (
                            <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ${CONTRACT_TYPE_COLORS[item]}`}>
                                {getContractTypeLabel(item)}
                            </span>
                        )}
                    />
                </FormField>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <FormField label="Діє з">
                        <input
                            type="date"
                            className={inputBase}
                            value={form.validFrom}
                            onChange={e => setForm({ ...form, validFrom: e.target.value })}
                        />
                    </FormField>

                    <FormField label="Діє до">
                        <input
                            type="date"
                            className={inputBase}
                            value={form.validTo}
                            onChange={e => setForm({ ...form, validTo: e.target.value })}
                        />
                    </FormField>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    <FormField label="Знижка на роботи, %">
                        <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.01"
                            className={inputBase}
                            value={form.discountLabor}
                            onChange={e => setForm({ ...form, discountLabor: e.target.value })}
                        />
                    </FormField>

                    <FormField label="Знижка на запчастини, %">
                        <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.01"
                            className={inputBase}
                            value={form.discountParts}
                            onChange={e => setForm({ ...form, discountParts: e.target.value })}
                        />
                    </FormField>

                    <FormField label="Знижка на доставку, %">
                        <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.01"
                            className={inputBase}
                            value={form.discountDelivery}
                            onChange={e => setForm({ ...form, discountDelivery: e.target.value })}
                        />
                    </FormField>
                </div>

                <FormField label="Нотатки">
                    <textarea
                        className={`${inputBase} h-28 py-2`}
                        value={form.notes}
                        onChange={e => setForm({ ...form, notes: e.target.value })}
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
