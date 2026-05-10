// pages/claims/tabs/ClaimHistoryDescription

import type { ReactNode } from 'react';

import type { RoleInClaim } from '../../../types/claim/assignedClaim';
import type { ClaimHistory } from '../../../types/claim/claimHistory';
import type { ClaimStatus } from '../../../types/claim/claim';
import type { DeliveryProvider, DeliveryStatus, DeliveryType } from '../../../types/delivery';
import type { InvoiceStatus } from '../../../types/invoice';

import { DELIVERY_PROVIDER_LABELS, DELIVERY_STATUS_LABELS, DELIVERY_TYPE_LABELS } from '../../../utils/deliveryLabels';
import { INVOICE_STATUS_LABELS } from '../../../utils/invoiceLabels';

import ClaimStatusBadge from '../../../components/badges/ClaimStatusBadge';
import DeliveryStatusBadge from '../../../components/badges/DeliveryStatusBadge';
import DeliveryTypeBadge from '../../../components/badges/DeliveryTypeBadge';
import InvoiceStatusBadge from '../../../components/badges/InvoiceStatusBadge';
import RoleInClaimBadge from '../../../components/badges/RoleInClaimBadge';

interface Props {
    item: ClaimHistory;
}

const STATUS_TRANSITION_REGEX = /([A-Z_]+)\s*→\s*([A-Z_]+)/;
const DELIVERY_STATUS_TRANSITION_REGEX = /^Зміна статусу доставки #(\d+):\s*([A-Z_]+)\s*→\s*([A-Z_]+)$/;
const DELIVERY_DETAILS_REGEX = /^(Створено|Оновлено|Видалено) доставку #(\d+)\. Тип: ([A-Z_]+)\. Провайдер: ([A-Z_]+)(?:\. Статус: ([A-Z_]+))?(?:\. Трек: (.*))?$/;
const INVOICE_OVERDUE_REGEX = /^Рахунок прострочений \(([A-Z_]+)\)$/;
const ROLE_ASSIGNMENT_REGEX = /^Працівник (.+) призначив (.+) з роллю (.+)$/;
const ROLE_CHANGE_REGEX = /^Працівник (.+) змінив роль (.+) з (.+) на (.+)$/;

const HISTORY_ROLE_LABELS: Record<string, RoleInClaim> = {
    'головного інженера': 'LEAD',
    асистента: 'ASSISTANT',
    діагноста: 'DIAGNOSTIC',
    монтажника: 'INSTALLER',
    експерта: 'EXPERT',
};

function isDeliveryStatus(value: string): value is DeliveryStatus {
    return value in DELIVERY_STATUS_LABELS;
}

function isDeliveryType(value: string): value is DeliveryType {
    return value in DELIVERY_TYPE_LABELS;
}

function isDeliveryProvider(value: string): value is DeliveryProvider {
    return value in DELIVERY_PROVIDER_LABELS;
}

function isInvoiceStatus(value: string): value is InvoiceStatus {
    return value in INVOICE_STATUS_LABELS;
}

function parseStatusTransition(text: string): {
    from: ClaimStatus;
    to: ClaimStatus;
} | null {
    const match = text.match(STATUS_TRANSITION_REGEX);

    if (!match) return null;

    return {
        from: match[1] as ClaimStatus,
        to: match[2] as ClaimStatus,
    };
}

function renderStatusTransition(text: string): ReactNode | null {
    const statusTransition = parseStatusTransition(text);

    if (!statusTransition) return null;

    return (
        <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-ink-muted">
            <span>Статус заявки змінено:</span>
            <ClaimStatusBadge status={statusTransition.from} shape="rounded" />
            <span>→</span>
            <ClaimStatusBadge status={statusTransition.to} shape="rounded" />
        </div>
    );
}

function renderDeliveryDescription(text: string): ReactNode | null {
    const transition = text.match(DELIVERY_STATUS_TRANSITION_REGEX);

    if (transition) {
        const [, deliveryId, from, to] = transition;

        if (!isDeliveryStatus(from) || !isDeliveryStatus(to)) return null;

        return (
            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-ink-muted">
                <span>Зміна статусу доставки #{deliveryId}:</span>
                <DeliveryStatusBadge status={from} shape="rounded" />
                <span>→</span>
                <DeliveryStatusBadge status={to} shape="rounded" />
            </div>
        );
    }

    const details = text.match(DELIVERY_DETAILS_REGEX);

    if (!details) return null;

    const [, action, deliveryId, type, provider, status, trackingCode] = details;

    if (!isDeliveryType(type)) return null;

    return (
        <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-ink-muted">
            <span>{action} доставку #{deliveryId}.</span>
            <span>Тип:</span>
            <DeliveryTypeBadge type={type} shape="rounded" />
            <span>
                Провайдер: {isDeliveryProvider(provider) ? DELIVERY_PROVIDER_LABELS[provider] : provider}
            </span>
            {status && isDeliveryStatus(status) && (
                <>
                    <span>Статус:</span>
                    <DeliveryStatusBadge status={status} shape="rounded" />
                </>
            )}
            {trackingCode && (
                <span>Трек: {trackingCode}</span>
            )}
        </div>
    );
}

function renderInvoiceDescription(text: string): ReactNode | null {
    const match = text.match(INVOICE_OVERDUE_REGEX);

    if (!match || !isInvoiceStatus(match[1])) return null;

    return (
        <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-ink-muted">
            <span>Рахунок перейшов у статус</span>
            <InvoiceStatusBadge status={match[1]} shape="rounded" />
        </div>
    );
}

function renderRoleDescription(text: string): ReactNode | null {
    const assignment = text.match(ROLE_ASSIGNMENT_REGEX);

    if (assignment) {
        const [, performer, target, roleLabel] = assignment;
        const role = HISTORY_ROLE_LABELS[roleLabel];

        if (!role) return null;

        return (
            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-ink-muted">
                <span>Працівник {performer} призначив {target} з роллю</span>
                <RoleInClaimBadge role={role} shape="rounded" />
            </div>
        );
    }

    const roleChange = text.match(ROLE_CHANGE_REGEX);

    if (!roleChange) return null;

    const [, performer, target, fromLabel, toLabel] = roleChange;
    const from = HISTORY_ROLE_LABELS[fromLabel];
    const to = HISTORY_ROLE_LABELS[toLabel];

    if (!from || !to) return null;

    return (
        <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-ink-muted">
            <span>Працівник {performer} змінив роль {target}:</span>
            <RoleInClaimBadge role={from} shape="rounded" />
            <span>→</span>
            <RoleInClaimBadge role={to} shape="rounded" />
        </div>
    );
}

function renderKnownHistoryDescription(item: ClaimHistory): ReactNode | null {
    if (!item.description) return null;

    if (item.actionType === 'STATUS_CHANGE') {
        return renderStatusTransition(item.description);
    }

    if (item.actionType === 'DELIVERY_EVENT') {
        return renderDeliveryDescription(item.description);
    }

    return (
        renderInvoiceDescription(item.description) ??
        renderRoleDescription(item.description)
    );
}

export default function ClaimHistoryDescription({ item }: Props) {
    const knownDescription = renderKnownHistoryDescription(item);

    if (knownDescription) return <>{knownDescription}</>;

    if (!item.description) return null;

    return (
        <div className="text-sm text-ink whitespace-pre-line mt-1">
            {item.description}
        </div>
    );
}
