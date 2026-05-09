// pages/clients/modals/EditClientContractModal.tsx

import { useMemo, useState } from 'react';

import type { Client } from '../../../types/client/client';
import type { ClientContract } from '../../../types/clientContract/clientContract';
import type { UpdateClientContractPayload } from '../../../types/clientContract/clientContractPayloads';

import Button from '../../../ui/Button';
import FormField from '../../../ui/FormField';
import Modal from '../../../ui/Modal/Modal';
import ModalFooter from '../../../ui/Modal/ModalFooter';
import Select from '../../../ui/Select';
import { inputBase } from '../../../ui/formStyles';

import {
    CONTRACT_STATUS_OPTIONS,
    CONTRACT_TYPE_OPTIONS,
    getContractStatusLabel,
    getContractTypeLabel,
} from '../../../utils/clientContractLabel';
import ContractStatusBadge from '../../../components/badges/ContractStatusBadge';
import ContractTypeBadge from '../../../components/badges/ContractTypeBadge';

interface Props {
    contract: ClientContract;
    clients: Client[];
    clientsLoading: boolean;
    updating: boolean;
    onClose: () => void;
    onSave: (payload: UpdateClientContractPayload) => Promise<void>;
}

function isDiscountValid(value: string) {
    if (!value.trim()) return false;
    const number = Number(value);
    return !Number.isNaN(number) && number >= 0 && number <= 100;
}

export default function EditClientContractModal({
    contract,
    clients,
    clientsLoading,
    updating,
    onClose,
    onSave,
}: Props) {
    const clientName =
        clients.find(client => client.id === contract.clientId)?.organizationName ??
        contract.clientOrganizationName;

    const [form, setForm] = useState({
        contractName: contract.contractName,
        contractType: contract.contractType,
        status: contract.status,
        validFrom: contract.validFrom,
        validTo: contract.validTo,
        discountLabor: contract.discountLabor.toString(),
        discountParts: contract.discountParts.toString(),
        discountDelivery: contract.discountDelivery.toString(),
        notes: contract.notes ?? '',
    });

    const dateRangeValid = useMemo(
        () =>
            Boolean(form.validFrom && form.validTo) &&
            form.validFrom <= form.validTo,
        [form.validFrom, form.validTo]
    );

    const canSubmit = useMemo(
        () =>
            form.contractName.trim() &&
            form.contractType &&
            form.status &&
            dateRangeValid &&
            isDiscountValid(form.discountLabor) &&
            isDiscountValid(form.discountParts) &&
            isDiscountValid(form.discountDelivery),
        [dateRangeValid, form]
    );

    const handleSubmit = async () => {
        if (!canSubmit) return;

        await onSave({
            contractName: form.contractName.trim(),
            contractType: form.contractType,
            status: form.status,
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
        <Modal title="Редагувати контракт" onClose={onClose} width="lg">
            <div className="space-y-4">
                <div className="rounded-xl border border-border bg-surface-muted p-4">
                    <div className="text-xs font-medium uppercase tracking-wide text-ink-muted">
                        Клієнт
                    </div>
                    <div className="mt-2 text-sm text-ink">
                        {clientsLoading ? 'Завантаження…' : clientName}
                    </div>
                </div>

                <FormField label="Назва договору">
                    <input
                        className={inputBase}
                        value={form.contractName}
                        onChange={e => setForm({ ...form, contractName: e.target.value })}
                    />
                </FormField>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <FormField label="Тип договору">
                        <Select
                            value={form.contractType}
                            onChange={value => setForm({ ...form, contractType: value })}
                            options={CONTRACT_TYPE_OPTIONS}
                            getLabel={item => getContractTypeLabel(item)}
                            getValue={item => item}
                            renderOption={item => (
                                <ContractTypeBadge type={item} />
                            )}
                            renderValue={item => (
                                <ContractTypeBadge type={item} />
                            )}
                        />
                    </FormField>

                    <FormField label="Статус">
                        <Select
                            value={form.status}
                            onChange={value => setForm({ ...form, status: value })}
                            options={CONTRACT_STATUS_OPTIONS}
                            getLabel={item => getContractStatusLabel(item)}
                            getValue={item => item}
                            renderOption={item => (
                                <ContractStatusBadge status={item} />
                            )}
                            renderValue={item => (
                                <ContractStatusBadge status={item} />
                            )}
                        />
                    </FormField>
                </div>

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
                    disabled={updating || !canSubmit}
                >
                    {updating ? 'Збереження...' : 'Зберегти'}
                </Button>
            </ModalFooter>
        </Modal>
    );
}
