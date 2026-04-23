// utils/phone.ts

export const PHONE_COUNTRY_PREFIX = '+380';
export const PHONE_COUNTRY_DIGITS = '380';
export const PHONE_LOCAL_DIGIT_COUNT = 9;

const PHONE_VALUE_PATTERN = /^\+380\d{9}$/;
const PHONE_FORMAT_PATTERN = /^(\+380)(\d{2})(\d{3})(\d{2})(\d{2})$/;
const NON_DIGIT_PATTERN = /\D/g;

export interface PhoneValidationOptions {
    required?: boolean;
    requiredErrorMessage?: string;
    invalidErrorMessage?: string;
}

function extractDigits(value: string): string {
    return value.replace(NON_DIGIT_PATTERN, '');
}

export function formatPhoneLocalDigits(local: string): string {
    const digits = local.replace(/\D/g, '').slice(0, 9);

    if (digits.length <= 2) return digits;
    if (digits.length <= 5) return `${digits.slice(0, 2)} ${digits.slice(2)}`;
    if (digits.length <= 7) return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}`;

    return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 7)} ${digits.slice(7)}`;
}

export function extractPhoneLocalDigits(value: string): string {
    const digits = extractDigits(value);

    if (!digits) {
        return '';
    }

    if (digits.startsWith(PHONE_COUNTRY_DIGITS)) {
        return digits.slice(
            PHONE_COUNTRY_DIGITS.length,
            PHONE_COUNTRY_DIGITS.length + PHONE_LOCAL_DIGIT_COUNT,
        );
    }

    if (digits.startsWith('0')) {
        if (digits.length === 1) {
            return digits;
        }

        return digits.slice(1, 1 + PHONE_LOCAL_DIGIT_COUNT);
    }

    return digits.slice(0, PHONE_LOCAL_DIGIT_COUNT);
}

export function normalizePhoneNumber(value: string): string {
    const digits = extractDigits(value);

    if (!digits) {
        return '';
    }

    if (digits.startsWith(PHONE_COUNTRY_DIGITS)) {
        const localDigits = digits.slice(
            PHONE_COUNTRY_DIGITS.length,
            PHONE_COUNTRY_DIGITS.length + PHONE_LOCAL_DIGIT_COUNT,
        );

        return localDigits ? `${PHONE_COUNTRY_PREFIX}${localDigits}` : '';
    }

    if (digits.startsWith('0')) {
        if (digits.length === 1) {
            return `${PHONE_COUNTRY_PREFIX}${digits}`;
        }

        return `${PHONE_COUNTRY_PREFIX}${digits.slice(1, 1 + PHONE_LOCAL_DIGIT_COUNT)}`;
    }

    return `${PHONE_COUNTRY_PREFIX}${digits.slice(0, PHONE_LOCAL_DIGIT_COUNT)}`;
}

export function isPhoneNumberValid(value: string): boolean {
    const normalizedPhone = normalizePhoneNumber(value);

    return PHONE_VALUE_PATTERN.test(normalizedPhone);
}

export function formatPhoneNumber(value: string | null | undefined): string {
    if (!value) {
        return '';
    }

    const normalizedPhone = normalizePhoneNumber(value);

    if (!PHONE_VALUE_PATTERN.test(normalizedPhone)) {
        return value;
    }

    return normalizedPhone.replace(PHONE_FORMAT_PATTERN, '$1 $2 $3 $4 $5');
}

export function getPhoneValidationError(
    value: string,
    {
        required = false,
        requiredErrorMessage = 'Телефон обовʼязковий',
        invalidErrorMessage = 'Телефон повинен бути у форматі +380 XX XXX XX XX',
    }: PhoneValidationOptions = {},
): string | undefined {
    const localDigits = extractPhoneLocalDigits(value);

    if (!localDigits) {
        return required ? requiredErrorMessage : undefined;
    }

    return isPhoneNumberValid(value) ? undefined : invalidErrorMessage;
}
