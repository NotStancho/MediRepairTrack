// pages/clients/modals/ViewClientModal.tsx

import type { ReactNode } from 'react';

import type { ClientFull } from '../../../types/client/clientFull';

import Button from '../../../ui/Button';
import Modal from '../../../ui/Modal/Modal';
import ModalFooter from '../../../ui/Modal/ModalFooter';
import { formatPhoneNumber } from '../../../utils/phone';

interface Props {
    client: ClientFull;
    onClose: () => void;
}

function InfoCard({
    label,
    value,
    mono = false,
}: {
    label: string;
    value: ReactNode;
    mono?: boolean;
}) {
    return (
        <div className="rounded-xl border border-border bg-surface-muted p-4">
            <div className="text-xs font-medium uppercase tracking-wide text-ink-muted">
                {label}
            </div>
            <div className={`mt-2 text-sm text-ink ${mono ? 'font-mono' : ''}`}>
                {value}
            </div>
        </div>
    );
}

export default function ViewClientModal({ client, onClose }: Props) {
    const fullName = [
        client.userLastName,
        client.userFirstName,
        client.userMiddleName,
    ].filter(Boolean).join(' ');

    return (
        <Modal
            title={`Клієнт: ${client.organizationName}`}
            onClose={onClose}
            width="lg"
        >
            <div className="space-y-5">
                <div className="rounded-2xl border border-border bg-linear-to-r from-brand-soft to-surface p-5">
                    <div className="text-xs font-medium uppercase tracking-wide text-ink-muted">
                        Організація
                    </div>
                    <div className="mt-2 text-xl font-semibold text-ink">
                        {client.organizationName}
                    </div>
                    <div className="mt-3 inline-flex items-center rounded-full border border-border bg-surface px-3 py-1 text-sm text-ink-muted">
                        Контактна особа: {client.contactPersonName ?? 'Не вказано'}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <InfoCard label="Email організації" value={client.organizationEmail} />
                    <InfoCard
                        label="Телефон організації"
                        value={formatPhoneNumber(client.organizationPhoneNumber)}
                        mono
                    />
                </div>

                <InfoCard label="Адреса" value={client.address} />

                <div className="rounded-xl border border-border bg-surface-muted p-4">
                    <div className="text-xs font-medium uppercase tracking-wide text-ink-muted">
                        Нотатки
                    </div>
                    <div className="mt-2 whitespace-pre-line text-sm leading-6 text-ink">
                        {client.notes?.trim() || 'Нотатки відсутні'}
                    </div>
                </div>

                <div className="rounded-xl border border-border bg-surface-muted p-4">
                    <div className="text-xs font-medium uppercase tracking-wide text-ink-muted">
                        Прив'язаний кабінет
                    </div>
                    {client.userId ? (
                        <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
                            <InfoCard label="ID користувача" value={`#${client.userId}`} mono />
                            <InfoCard label="Email користувача" value={client.userEmail ?? '—'} />
                            <InfoCard label="ПІБ" value={fullName || '—'} />
                            <InfoCard
                                label="Телефон користувача"
                                value={client.userPhone ? formatPhoneNumber(client.userPhone) : '—'}
                                mono
                            />
                        </div>
                    ) : (
                        <div className="mt-2 text-sm text-ink-muted">
                            До клієнта не прив'язано користувацький кабінет.
                        </div>
                    )}
                </div>
            </div>

            <ModalFooter>
                <Button variant="secondary" onClick={onClose}>
                    Закрити
                </Button>
            </ModalFooter>
        </Modal>
    );
}
