// utils/formats/dateShortFormat.ts

export function formatDateShort(value?: string | null) {
    if (!value) return '-';

    return new Intl.DateTimeFormat('uk-UA', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    }).format(new Date(value));
}