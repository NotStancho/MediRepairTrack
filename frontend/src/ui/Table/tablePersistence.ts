import { useEffect } from 'react';
import type {
    ColumnPinningState,
    ColumnSizingState,
    SortingState,
    VisibilityState,
} from '@tanstack/react-table';

export type PersistedTableState = {
    sorting?: SortingState;
    columnVisibility?: VisibilityState;
    columnOrder?: string[];
    columnPinning?: ColumnPinningState;
    columnSizing?: ColumnSizingState;
};

const STORAGE_VERSION = 1;

export function readPersistedTableState(storageKey?: string): PersistedTableState | null {
    if (!storageKey || typeof window === 'undefined') return null;

    try {
        const raw = window.localStorage.getItem(storageKey);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (!parsed || parsed.v !== STORAGE_VERSION) return null;
        return parsed.state ?? null;
    } catch {
        return null;
    }
}

interface PersistArgs {
    storageKey?: string;
    enabled?: boolean;
    state: PersistedTableState;
}

export function useTableStatePersistence({ storageKey, enabled = true, state }: PersistArgs) {
    const {
        sorting,
        columnVisibility,
        columnOrder,
        columnPinning,
        columnSizing,
    } = state;

    useEffect(() => {
        if (!storageKey || !enabled || typeof window === 'undefined') return;

        const handle = window.setTimeout(() => {
            const payload = {
                v: STORAGE_VERSION,
                state: {
                    sorting,
                    columnVisibility,
                    columnOrder,
                    columnPinning,
                    columnSizing,
                },
            };
            window.localStorage.setItem(storageKey, JSON.stringify(payload));
        }, 150);

        return () => window.clearTimeout(handle);
    }, [
        storageKey,
        enabled,
        sorting,
        columnVisibility,
        columnOrder,
        columnPinning,
        columnSizing,
    ]);
}
