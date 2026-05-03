// utils/formats/partQuantityFormat.ts

import type { PartUnitType } from '../../types/part/partUnitType';

const FRACTIONAL_STEP = '0.001';
const PIECE_STEP = '1';

export function formatPartQuantity(
    value?: number | null,
    unitName?: string | null
) {
    if (value == null) return '-';

    const formatted = Number.isInteger(value)
        ? value.toLocaleString('uk-UA')
        : value.toLocaleString('uk-UA', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 3,
        });

    return unitName ? `${formatted} ${unitName}` : formatted;
}

export function parsePartQuantityInput(value: string): number | null {
    const normalized = value.replace(',', '.').trim();

    if (!normalized) {
        return null;
    }

    const parsed = Number(normalized);

    return Number.isFinite(parsed) ? parsed : null;
}

export function normalizePartQuantityInput(
    value: string,
    unitType?: PartUnitType | null,
) {
    const normalized = value.replace(',', '.');

    if (unitType === 'PIECE') {
        return normalized.split('.')[0].replace(/[^\d]/g, '');
    }

    const sanitized = normalized.replace(/[^\d.]/g, '');
    const [integerPart, ...fractionParts] = sanitized.split('.');

    if (fractionParts.length === 0) {
        return integerPart;
    }

    const fraction = fractionParts.join('').slice(0, 3);

    return `${integerPart}.${fraction}`;
}

export function getPartQuantityStep(unitType?: PartUnitType | null) {
    return unitType === 'PIECE' ? PIECE_STEP : FRACTIONAL_STEP;
}

export function getPartQuantityMin(
    unitType?: PartUnitType | null,
    options: { allowZero?: boolean } = {},
) {
    if (options.allowZero) {
        return '0';
    }

    return unitType === 'PIECE' ? PIECE_STEP : FRACTIONAL_STEP;
}

interface PartQuantityValidationOptions {
    unitType?: PartUnitType | null;
    unitName?: string | null;
    max?: number | null;
    allowZero?: boolean;
    requiredMessage?: string;
    positiveMessage?: string;
    integerMessage?: string;
    maxMessage?: string;
}

export function getPartQuantityError(
    value: number | null,
    {
        unitType,
        unitName,
        max,
        allowZero = false,
        requiredMessage = 'Вкажіть коректну кількість',
        positiveMessage,
        integerMessage,
        maxMessage,
    }: PartQuantityValidationOptions = {},
) {
    if (value == null) {
        return requiredMessage;
    }

    if (allowZero ? value < 0 : value <= 0) {
        return positiveMessage ?? (
            allowZero
                ? 'Кількість не може бути відʼємною'
                : 'Кількість має бути більше 0'
        );
    }

    if (unitType === 'PIECE' && !Number.isInteger(value)) {
        return integerMessage ?? `Для одиниці "${unitName}" потрібне ціле число`;
    }

    if (max != null && value > max) {
        return maxMessage ?? `На складі доступно: ${formatPartQuantity(max, unitName)}`;
    }

    return undefined;
}
