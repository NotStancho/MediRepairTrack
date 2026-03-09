// ui/Table/tableUtils.ts
import type { FilterFn, Updater } from '@tanstack/react-table';

// Simple case-insensitive contains filter for global search / column filters.
export function createFuzzyTextFilter<TData>(): FilterFn<TData> {
    return (row, columnId, value) => {
        const raw = row.getValue(columnId);
        if (raw == null) return false;

        return String(raw).toLowerCase().includes(String(value).toLowerCase());
    };
}

// Normalizes TanStack updater (value or function) to the next value.
export function resolveUpdater<T>(updater: Updater<T>, current: T): T {
    return typeof updater === 'function'
        ? (updater as (prev: T) => T)(current)
        : updater;
}

// Horizontal text alignment utility.
export function getAlignClass(align?: string) {
    if (align === 'center') return 'text-center';
    if (align === 'right') return 'text-right';
    return 'text-left';
}
