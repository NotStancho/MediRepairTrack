// ui/Table/Table.tsx
import type { ReactNode } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
    getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel,
    type ColumnFiltersState, type ColumnPinningState, type PaginationState, type Row, type SortingState,
    type Table, type TableState, type VisibilityState, useReactTable,
} from '@tanstack/react-table';

import TablePagination from './TablePagination';
import TableEmpty from './TableEmpty';
import TableHeader from './TableHeader';
import TableBody from './TableBody';
import {createFuzzyTextFilter, resolveUpdater} from './tableUtils';
import type { TableColumnDef } from './types';

type Density = 'comfortable' | 'compact';

interface Props<TData> {
    /* ======================
     * Data & columns
     * ====================== */

    // Column definitions (TanStack ColumnDef). Defines headers, cell renderers, sorting, filtering, meta, etc.
    columns: TableColumnDef<TData>[];

    // Table data to render. When using server-side mode, it usually contains only current page rows.
    data: TData[];

    // Shows loading state (skeleton rows / disabled interactions).
    loading?: boolean;


    /* ======================
     * Server-side behavior
     * ====================== */

    // Enable server-side pagination. When true, a table will NOT paginate data on the client.
    manualPagination?: boolean;

    // Enables server-side sorting. When true, the sorting state is controlled externally (e.g., backend).
    manualSorting?: boolean;

    // Enables server-side filtering (column & global). When true, filtering logic is expected to be handled outside.
    manualFiltering?: boolean;

    // Total number of pages (required for server-side pagination).
    pageCount?: number;

    // Total number of items in the table (used for pagination label: "X - Y of Z").
    totalItems?: number;


    /* ======================
     * Initial & identity
     * ====================== */

    // Initial table state (sorting, pagination, filters, visibility). Applied only on the first render.
    initialState?: Partial<TableState>;

    // Custom row id resolver. Useful when row.id is not stable or not present.
    getRowId?: (row: TData, index: number) => string;


    /* ======================
     * UI composition
     * ====================== */

    // Optional toolbar renderer (search, filters, column visibility, actions). Receives TanStack table instance.
    renderToolbar?: (table: Table<TData>) => ReactNode;

    // Custom empty state component. Rendered when there are no rows and not loading.
    renderEmptyState?: ReactNode;


    /* ======================
     * Row interaction & styling
     * ====================== */

    // Row click handler. Useful for navigation or opening details.
    onRowClick?: (row: Row<TData>) => void;

    // Optional custom className per row. Allows highlighting or conditional styling.
    rowClassName?: (row: Row<TData>) => string | undefined;

    /**
    * Table density (controls cell padding).
    * - 'comfortable' - more spacing, better readability
    * - 'compact' - denser rows, more data on screen
    */
    density?: Density;

    // Enables zebra-striping (alternating row background). Improves readability for wide or dense tables.
    striped?: boolean;

    // Controls rendering of pagination footer.
    showPagination?: boolean;

    // Additional container className.
    className?: string;

    // Enables column resizing via drag-handle.
    enableColumnResize?: boolean;

    // Enables column reordering via drag & drop in header.
    enableColumnReorder?: boolean;

    // Enables pinning columns left/right.
    enableColumnPinning?: boolean;

    // Virtualization (vertical) to speed up big tables.
    virtualization?: {
        height: number;           // px
        estimateSize?: number;    // px row height estimate
        overscan?: number;
    };

    /* ======================
     * State change callbacks
     * ====================== */

    // Sorting state change callback. Useful for syncing sorting with backend.
    onSortingChange?: (sorting: SortingState) => void;

    // Column filters state change callback (server-side filtering).
    onColumnFiltersChange?: (filters: ColumnFiltersState) => void;

    // Global search value change callback.
    onGlobalFilterChange?: (value: string) => void;

    // Pagination state change callback. Useful for server-side pagination
    onPaginationChange?: (pagination: PaginationState) => void;
}

export default function Table<TData>({
                                         columns,
                                         data,
                                         loading,
                                         manualPagination = false,
                                         manualSorting = false,
                                         manualFiltering = false,
                                         pageCount,
                                         totalItems,
                                         initialState,
                                         getRowId,
                                         renderToolbar,
                                         renderEmptyState,
                                         onRowClick,
    rowClassName,
    density = 'comfortable',
    striped = false,
    showPagination = true,
    className = '',
    enableColumnResize = true,
    enableColumnReorder = true,
    enableColumnPinning = true,
    virtualization,
    onSortingChange,
    onColumnFiltersChange,
    onGlobalFilterChange,
    onPaginationChange,
}: Props<TData>) {
    const [sorting, setSorting] = useState<SortingState>(initialState?.sorting ?? []);
    const fuzzyFilter = createFuzzyTextFilter<TData>();
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(initialState?.columnFilters ?? []);
    const [globalFilter, setGlobalFilter] = useState<string>((initialState?.globalFilter as string) ?? '');
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(initialState?.columnVisibility ?? {});
    const [pagination, setPagination] = useState<PaginationState>(
        initialState?.pagination ?? { pageIndex: 0, pageSize: 10 },
    );
    const [columnPinning, setColumnPinning] = useState<ColumnPinningState>(
        initialState?.columnPinning ?? { left: [], right: [] },
    );
    const [columnOrder, setColumnOrder] = useState<string[]>([]);
    const [draggingColumnId, setDraggingColumnId] = useState<string | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);

    const resolvedColumnIds = useMemo(() => {
        return columns.map((col, idx) => {
            if (col.id) return col.id;

            const accessorKey = (col as { accessorKey?: string }).accessorKey;
            if (accessorKey) return accessorKey;

            return `col_${idx}`;
        });
    }, [columns]);

    // Keep columnOrder in sync with incoming column defs (e.g., conditional columns).
    useEffect(() => {
        setColumnOrder(prev => {
            if (!prev.length) return resolvedColumnIds;

            const filtered = prev.filter(id => resolvedColumnIds.includes(id));
            const missing = resolvedColumnIds.filter(id => !filtered.includes(id));
            const next = [...filtered, ...missing];

            const unchanged = next.length === prev.length && next.every((id, idx) => id === prev[idx]);
            return unchanged ? prev : next;
        });
    }, [resolvedColumnIds]);

    // eslint-disable-next-line react-hooks/incompatible-library
    const table = useReactTable<TData>({
        data,
        columns,
        state: {
            sorting,
            columnFilters,
            globalFilter,
            columnVisibility,
            pagination,
            columnOrder,
            columnPinning,
        },
        onSortingChange: updater => {
            const next = resolveUpdater(updater, sorting);
            setSorting(next);
            onSortingChange?.(next);
        },
        onColumnFiltersChange: updater => {
            const next = resolveUpdater(updater, columnFilters);
            setColumnFilters(next);
            onColumnFiltersChange?.(next);
        },
        onGlobalFilterChange: updater => {
            const next = resolveUpdater(updater, globalFilter);
            setGlobalFilter(next);
            onGlobalFilterChange?.(next);
        },
        onPaginationChange: updater => {
            const next = resolveUpdater(updater, pagination);
            setPagination(next);
            onPaginationChange?.(next);
        },
        onColumnVisibilityChange: updater => {
            const next = resolveUpdater(updater, columnVisibility);
            setColumnVisibility(next);
        },
        onColumnPinningChange: updater => {
            const next = resolveUpdater(updater, columnPinning);
            setColumnPinning(next);
        },
        onColumnOrderChange: updater => {
            const next = resolveUpdater(updater, columnOrder);
            setColumnOrder(next);
        },
        manualPagination,
        manualSorting,
        manualFiltering,
        pageCount: manualPagination ? pageCount : undefined,
        globalFilterFn: fuzzyFilter,
        filterFns: { fuzzy: fuzzyFilter },
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: manualFiltering ? undefined : getFilteredRowModel(),
        getSortedRowModel: manualSorting ? undefined : getSortedRowModel(),
        getPaginationRowModel: manualPagination ? undefined : getPaginationRowModel(),
        getRowId,
        autoResetAll: false,
        columnResizeMode: enableColumnResize ? 'onChange' : undefined,
    });

    const rows = table.getRowModel().rows;

    const columnCount = table.getAllLeafColumns().length || 1;
    const emptyState = renderEmptyState ?? <TableEmpty />;

    const cellPadding = density === 'compact' ? 'px-3 py-2' : 'px-4 py-2.5';

    const headerClass =
        'bg-surface-muted text-ink-muted text-[11px] uppercase tracking-wide font-semibold border-b border-border';

    const bodyRowBase = `
        border-b border-border
        ${striped ? 'odd:bg-surface even:bg-surface-muted/40' : ''}
        hover:bg-brand-soft/50
        transition-colors
    `;

    const containerClasses = `
        rounded-xl border border-border bg-surface shadow-sm
        ${className}
    `;

    const resolvedTotalItems = totalItems ?? (manualPagination || manualFiltering
        ? data.length
        : table.getFilteredRowModel().rows.length);

    const virtualizationEnabled =
        !!virtualization && !showPagination && !manualPagination;


    const leftPinnedColumns = table.getLeftLeafColumns();
    const rightPinnedColumns = table.getRightLeafColumns();
    const columnSizing = table.getState().columnSizing;

    const pinnedOffsets = useMemo(() => {
        const left = new Map<string, number>();
        const right = new Map<string, number>();

        let accLeft = 0;
        leftPinnedColumns.forEach(col => {
            left.set(col.id, accLeft);
            accLeft += col.getSize();
        });

        let accRight = 0;
        [...rightPinnedColumns].reverse().forEach(col => {
            right.set(col.id, accRight);
            accRight += col.getSize();
        });

        return { left, right };
    }, [leftPinnedColumns, rightPinnedColumns, columnSizing]);

    const handleColumnReorder = (dragId: string, targetId: string) => {
        if (dragId === targetId) return;

        const dragCol = table.getColumn(dragId);
        const targetCol = table.getColumn(targetId);

        if (!dragCol || !targetCol) return;
        if (dragCol.getIsPinned() !== targetCol.getIsPinned()) return;

        setColumnOrder(prev => {
            const next = prev.filter(id => id !== dragId);
            const targetIndex = next.indexOf(targetId);
            if (targetIndex === -1) return prev;

            next.splice(targetIndex, 0, dragId);
            return next;
        });

        if (dragCol.getIsPinned() === 'left') {
            setColumnPinning(p => ({
                ...p,
                left: reorder(p.left ?? [], dragId, targetId),
            }));
        }

        if (dragCol.getIsPinned() === 'right') {
            setColumnPinning(p => ({
                ...p,
                right: reorder(p.right ?? [], dragId, targetId),
            }));
        }
    };

    function reorder(arr: string[], from: string, to: string) {
        const next = arr.filter(id => id !== from);
        const idx = next.indexOf(to);
        if (idx === -1) return arr;
        next.splice(idx, 0, from);
        return next;
    }

    return (
        <div className={containerClasses}>
            {renderToolbar && (
                <div className="border-b border-border">
                    {renderToolbar(table)}
                </div>
            )}


                <div
                    ref={scrollContainerRef}
                    className="overflow-x-auto"
                    style={
                        virtualizationEnabled
                            ? { maxHeight: virtualization?.height, overflowY: 'auto' }
                            : undefined
                    }
                >
                    <table className="w-full border-collapse text-sm">
                        <TableHeader
                            table={table}
                            cellPadding={cellPadding}
                            headerClass={headerClass}
                            enableColumnResize={enableColumnResize}
                            enableColumnReorder={enableColumnReorder}
                            onColumnReorder={handleColumnReorder}
                            onDragStart={setDraggingColumnId}
                            onDragEnd={() => setDraggingColumnId(null)}
                            draggingColumnId={draggingColumnId}
                            enableColumnPinning={enableColumnPinning}
                            pinnedOffsets={pinnedOffsets}
                            leftPinnedIds={table.getLeftLeafColumns().map(c => c.id)}
                            rightPinnedIds={table.getRightLeafColumns().map(c => c.id)}
                        />

                        <TableBody
                            rows={rows}
                            virtualization={virtualizationEnabled ? virtualization : undefined}
                            scrollElementRef={virtualizationEnabled ? scrollContainerRef : undefined}
                            columnCount={columnCount}
                            cellPadding={cellPadding}
                            bodyRowBase={bodyRowBase}
                            emptyState={emptyState}
                            loading={loading}
                            onRowClick={onRowClick}
                            rowClassName={rowClassName}
                            pinnedOffsets={pinnedOffsets}
                            leftPinnedIds={table.getLeftLeafColumns().map(c => c.id)}
                            rightPinnedIds={table.getRightLeafColumns().map(c => c.id)}
                        />
                    </table>
                </div>


            {showPagination && (
                <TablePagination
                    table={table}
                    totalItems={resolvedTotalItems}
                />
            )}
        </div>
    );
}
