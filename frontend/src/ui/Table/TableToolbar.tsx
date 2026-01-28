// ui/Table/TableToolbar.tsx
import { useState } from 'react';
import type { ReactNode } from 'react';
import type { Table } from '@tanstack/react-table';
import { autoUpdate, flip, offset, shift, useDismiss, useFloating, useInteractions, } from '@floating-ui/react';
import Portal from '../Portal';
import Input from '../Input';
import Button from '../Button';
import { FiX } from 'react-icons/fi';

interface Props<TData> {
    table: Table<TData>;
    globalFilterPlaceholder?: string;
    enableGlobalFilter?: boolean;
    enableColumnVisibility?: boolean;
    leftSlot?: ReactNode;
    rightSlot?: ReactNode;
    className?: string;
}

export default function TableToolbar<TData>({
    table,
    globalFilterPlaceholder = 'Пошук…',
    enableGlobalFilter = true,
    enableColumnVisibility = true,
    leftSlot,
    rightSlot,
    className = '',
}: Props<TData>) {
    const globalFilter = (table.getState().globalFilter ?? '') as string;
    const columnFilters = table.getState().columnFilters;

    const hasFilters = columnFilters.length > 0 || globalFilter.trim().length > 0;

    const columns = table
        .getAllLeafColumns()
        .filter(column => column.getCanHide());

    const [openColumns, setOpenColumns] = useState(false);

    const { refs, floatingStyles, context } = useFloating({
        open: openColumns,
        onOpenChange: setOpenColumns,
        placement: 'bottom-end',
        middleware: [offset(6), flip(), shift()],
        whileElementsMounted: autoUpdate,
    });

    const dismiss = useDismiss(context);
    const { getReferenceProps, getFloatingProps } = useInteractions([dismiss]);

    const setReferenceRef = (node: HTMLButtonElement | null) => {
        refs.setReference(node);
    };
    const setFloatingRef = (node: HTMLDivElement | null) => {
        refs.setFloating(node);
    };

    return (
        <div className={`flex flex-wrap items-center gap-3 px-3 py-3 ${className}`}>
            {enableGlobalFilter && (
                <div className="relative w-full md:w-72">
                    <Input
                        value={globalFilter}
                        onChange={e => {
                            table.setGlobalFilter(e.target.value);
                            table.setPageIndex(0);
                        }}
                        placeholder={globalFilterPlaceholder}
                        className="pr-9"
                    />

                    {globalFilter && (
                        <button
                            onClick={() => table.setGlobalFilter('')}
                            className="
                                absolute right-2 top-1/2 -translate-y-1/2
                                flex items-center
                                text-ink-soft
                                hover:text-ink
                                hover:bg-surface-muted
                                rounded
                                p-1
                                transition-colors
                            "
                            aria-label="Очистити пошук"
                        >
                            <FiX size={16} />
                        </button>
                    )}
                </div>
            )}

            {leftSlot}

            {/* Spacer */}
            <div className="flex-1" />

            {hasFilters && (
                <Button
                    variant="secondary"
                    onClick={() => {
                        table.setGlobalFilter('');
                        table.resetColumnFilters();
                        table.setPageIndex(0);
                    }}
                    className="h-9 px-3 text-xs"
                >
                    Скинути фільтри
                </Button>
            )}

            {enableColumnVisibility && columns.length > 0 && (
                <>
                    <button
                        ref={setReferenceRef}
                        {...getReferenceProps()}
                        onClick={() => setOpenColumns(v => !v)}
                        className="
                            h-9 px-3 text-xs
                            rounded-lg border border-border bg-surface
                            hover:border-brand hover:text-brand
                            focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-ring
                            transition-colors
                        "
                    >
                        Колонки
                    </button>

                    {openColumns && (
                        <Portal>
                            <div
                                ref={setFloatingRef}
                                {...getFloatingProps()}
                                style={floatingStyles}
                                className="
                                    z-50
                                    mt-1 w-56
                                    rounded-lg border border-border
                                    bg-surface shadow-lg shadow-black/10
                                    p-2
                                "
                            >
                                <div className="flex items-center justify-between px-1 py-1 text-xs font-semibold text-ink">
                                    <span>Відображення колонок</span>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();

                                            const allVisible = Object.fromEntries(
                                                table.getAllLeafColumns().map(col => [col.id, true])
                                            );

                                            table.setColumnVisibility(allVisible);
                                        }}
                                        className="text-brand hover:underline"
                                    >
                                        Всі
                                    </button>
                                </div>

                                <div className="flex flex-col gap-1 max-h-64 overflow-y-auto">
                                    {columns.map(column => (
                                        <label
                                            key={column.id}
                                            className="
                                                flex items-center gap-2
                                                rounded-md px-2 py-1
                                                text-sm text-ink
                                                hover:bg-surface-muted
                                            "
                                        >
                                            <input
                                                type="checkbox"
                                                checked={column.getIsVisible()}
                                                onChange={e => column.toggleVisibility(e.target.checked)}
                                                className="h-4 w-4 rounded border-border text-brand focus:ring-brand-ring"
                                            />
                                            <span className="truncate">
                                                {column.columnDef.meta?.shortLabel ||
                                                    column.columnDef.meta?.label ||
                                                    (typeof column.columnDef.header === 'string'
                                                        ? column.columnDef.header
                                                        : column.id)}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </Portal>
                    )}
                </>
            )}

            {rightSlot}
        </div>
    );
}
