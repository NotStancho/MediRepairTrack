// pages/claims/tabs/ClaimDetailsTab.tsx

import {useEffect, useState} from 'react';
import type {Claim} from '../../../types/claim/claim';
import type {ClientFull} from '../../../types/client/clientFull';
import type {EquipmentFull} from '../../../types/equipment/equipmentFull';
import {getClientFullById} from '../../../api/client';
import {getEquipmentFullById} from '../../../api/equipment';
import {formatDateTime} from '../../../utils/formats/dateFormat';
import {formatPhoneNumber} from '../../../utils/phone';
import ClaimStatusBadge from '../../../components/badges/ClaimStatusBadge';
import RepairTypeBadge from '../../../components/badges/RepairTypeBadge';

interface Props {
    claim: Claim;
}

export default function ClaimDetailsTab({claim}: Props) {
    const [client, setClient] = useState<ClientFull | null>(null);
    const [equipment, setEquipment] = useState<EquipmentFull | null>(null);

    useEffect(() => {
        getClientFullById(claim.clientId).then(setClient);
        getEquipmentFullById(claim.equipmentId).then(setEquipment);
    }, [claim]);

    return (
        <div className="space-y-6 text-sm">

            {/* Заявка */}
            <section className="rounded-lg border border-border bg-surface p-4 shadow-sm">
                <h3 className="font-semibold mb-3 text-ink">
                    Інформація про заявку
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-ink-muted">Тип ремонту:</span>
                        <RepairTypeBadge type={claim.repairType} shape="rounded" />
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-ink-muted">Статус:</span>
                        <ClaimStatusBadge status={claim.status} shape="rounded" />
                    </div>
                    <div>Створено: {formatDateTime(claim.createdAt)}</div>
                    <div>Закрито: {claim.closedAt ? formatDateTime(claim.closedAt) : '-'}</div>

                    <div className="md:col-span-2">
                        <div className="text-ink-muted mb-1">Опис дефекту</div>
                        <div className="whitespace-pre-line">
                            {claim.defectDescription}
                        </div>
                    </div>
                </div>
            </section>

            {/* Клієнт */}
            {client && (
                <section className="rounded-lg border border-border bg-surface p-4 shadow-sm">
                    <h3 className="font-semibold mb-3 text-ink">
                        Клієнт
                    </h3>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>Організація: <b>{client.organizationName}</b></div>
                        <div>Контактна особа: {client.contactPersonName ?? '-'}</div>
                        <div>Email: {client.organizationEmail}</div>
                        <div>Телефон: {formatPhoneNumber(client.organizationPhoneNumber)}</div>
                        <div className="md:col-span-2">
                            Адреса: {client.address}
                        </div>
                    </div>
                </section>
            )}

            {/* Обладнання */}
            {equipment && (
                <section className="rounded-lg border border-border bg-surface p-4 shadow-sm">
                    <h3 className="font-semibold mb-3 text-ink">
                        Обладнання
                    </h3>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>Виробник: <b>{equipment.manufacturer}</b></div>
                        <div>Модель: {equipment.modelName}</div>
                        <div>Тип: {equipment.equipmentType}</div>
                        <div>Серійний номер: {equipment.serialNumber}</div>
                        <div>Дата покупки: {equipment.purchaseDate}</div>
                        <div>Дата релізу: {equipment.releaseDate}</div>
                    </div>
                </section>
            )}
        </div>
    );
}

