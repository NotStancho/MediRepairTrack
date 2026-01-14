export function formatMoney(value?: number | null): string {
    if (value == null) return '-';

    return value.toLocaleString('uk-UA', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}
