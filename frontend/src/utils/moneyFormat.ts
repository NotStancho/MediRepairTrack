export function formatMoney(value: number): string {
    return value.toLocaleString('uk-UA', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}
