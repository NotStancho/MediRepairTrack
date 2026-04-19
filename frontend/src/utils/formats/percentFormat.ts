// utils/formats/percentFormat.ts

export function formatPercent(value?: number | null) {
    if (value == null) return '-';

    return `${value.toLocaleString('uk-UA', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    })}%`;
}
