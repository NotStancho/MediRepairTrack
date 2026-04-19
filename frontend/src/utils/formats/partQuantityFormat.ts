// utils/formats/partQuantityFormat.ts

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
