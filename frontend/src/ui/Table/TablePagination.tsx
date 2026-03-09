// ui/Table/TablePagination.tsx
import type { Table } from '@tanstack/react-table';
import Button from '../Button';

interface Props<TData> {
    table: Table<TData>;
    totalItems?: number;
    pageSizeOptions?: number[];
    className?: string;
}

const DEFAULT_PAGE_SIZES = [10, 25, 50, 100];

export default function TablePagination<TData>({
    table,
    totalItems,
    pageSizeOptions = DEFAULT_PAGE_SIZES,
    className = '',
}: Props<TData>) {
    const { pageIndex, pageSize } = table.getState().pagination;
    const rowModel = table.getRowModel();

    const resolvedTotal = totalItems ?? table.getFilteredRowModel().rows.length;
    const from = rowModel.rows.length === 0 ? 0 : pageIndex * pageSize + 1;
    const rawTo = pageIndex * pageSize + rowModel.rows.length;
    const to = Number.isFinite(resolvedTotal)
        ? Math.min(resolvedTotal as number, rawTo)
        : rawTo;

    const totalLabel = Number.isFinite(resolvedTotal)
        ? `${resolvedTotal}`
        : '—';

    const canPrevious = table.getCanPreviousPage();
    const canNext = table.getCanNextPage();

    const totalPages = table.getPageCount();
    const hasPageCount = Number.isFinite(totalPages) && totalPages > 0;

    return (
        <div
            className={`
                flex flex-wrap items-center gap-3 justify-between
                px-3 py-3
                border-t border-border
                ${className}
            `}
        >
            <div className="flex items-center gap-2 text-xs text-ink-muted">
                <span>
                    Показано {from}-{to} з {totalLabel}
                </span>

                {hasPageCount && (
                    <span className="text-ink-soft">
                        • Сторінка {pageIndex + 1} з {totalPages}
                    </span>
                )}
            </div>

            <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-xs text-ink-muted">
                    <span>На сторінці</span>
                    <select
                        value={pageSize}
                        onChange={e => table.setPageSize(Number(e.target.value))}
                        className="
                            h-8 rounded-md border border-border bg-surface
                            px-2 text-sm text-ink
                            focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-ring
                        "
                    >
                        {pageSizeOptions.map(size => (
                            <option key={size} value={size}>
                                {size}
                            </option>
                        ))}
                    </select>
                </label>

                <div className="flex items-center gap-2">
                    <Button
                        variant="secondary"
                        disabled={!canPrevious}
                        onClick={() => table.previousPage()}
                        className="h-8 px-3 text-xs"
                    >
                        Назад
                    </Button>
                    <Button
                        variant="secondary"
                        disabled={!canNext}
                        onClick={() => table.nextPage()}
                        className="h-8 px-3 text-xs"
                    >
                        Далі
                    </Button>
                </div>
            </div>
        </div>
    );
}
