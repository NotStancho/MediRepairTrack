import type { ColumnDef } from '@tanstack/react-table';

export type TableColumnDef<TData, TValue = unknown> = ColumnDef<TData, TValue>;

export type TableColumnAlign = 'left' | 'center' | 'right';


declare module '@tanstack/table-core' {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface ColumnMeta<TData, TValue> {
        /**
         * Human-friendly header text. Falls back to header/id.
         */
        label?: string;
        /**
         * Horizontal alignment for cell content.
         */
        align?: TableColumnAlign;
        /**
         * Optional CSS classes for header cell.
         */
        headerClassName?: string;
        /**
         * Optional CSS classes for body cell.
         */
        cellClassName?: string;
        /**
         * Short label for column visibility menu.
         */
        shortLabel?: string;
        /**
         * Hide header icons (sort/pin/drag) when column width is below this value (px).
         */
        iconHideWidth?: number;
    }
}
