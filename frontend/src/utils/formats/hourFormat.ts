// utils/formats/hourFormat.ts

export function formatHours(value: number | null | undefined, fallback = 'Не задано') {
    if (value == null) return fallback;

    return `${value.toLocaleString('uk-UA', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    })} год`;
}