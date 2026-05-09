// pages/claims/tabs/ClaimInvoiceTab/invoiceDueDate.ts

export const DUE_DATE_EXTENSION_MAX_DAYS = 30;

const padDatePart = (value: number) => String(value).padStart(2, '0');

const toDateTimeLocalInput = (date: Date) => (
    [
        date.getFullYear(),
        padDatePart(date.getMonth() + 1),
        padDatePart(date.getDate()),
    ].join('-') + `T${padDatePart(date.getHours())}:${padDatePart(date.getMinutes())}`
);

const parseDateTime = (value?: string | null) => {
    if (!value) return null;

    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
};

const ceilToNextMinute = (date: Date) => {
    const result = new Date(date);
    result.setSeconds(0, 0);

    if (result.getTime() <= date.getTime()) {
        result.setMinutes(result.getMinutes() + 1);
    }

    return result;
};

const floorToMinute = (date: Date) => {
    const result = new Date(date);
    result.setSeconds(0, 0);
    return result;
};

const addDays = (date: Date, days: number) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};

export const getDueDateExtensionLimits = (dueAt?: string | null) => {
    const currentDueDate = parseDateTime(dueAt);

    if (!currentDueDate) return null;

    const afterCurrentDueDate = ceilToNextMinute(currentDueDate);
    const afterNow = ceilToNextMinute(new Date());
    const minDate = afterCurrentDueDate.getTime() > afterNow.getTime()
        ? afterCurrentDueDate
        : afterNow;
    const maxDate = floorToMinute(addDays(currentDueDate, DUE_DATE_EXTENSION_MAX_DAYS));

    return {
        min: toDateTimeLocalInput(minDate),
        max: toDateTimeLocalInput(maxDate),
        hasAllowedRange: minDate.getTime() <= maxDate.getTime(),
    };
};

export const toLocalDateTimePayload = (value: string) =>
    value.length === 16 ? `${value}:00` : value;
