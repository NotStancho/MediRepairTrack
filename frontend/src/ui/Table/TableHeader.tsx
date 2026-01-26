// ui/Table/TableHeader.tsx
import { flexRender, type Table } from '@tanstack/react-table';
import { getAlignClass } from './tableUtils';
import TableSortIcon from './TableSortIcon';
import { MdDragIndicator } from 'react-icons/md';
import { FiMapPin } from 'react-icons/fi';

interface Props<TData> {
    table: Table<TData>;
    cellPadding: string;
    headerClass: string;
    enableColumnResize: boolean;
    enableColumnReorder: boolean;
    onColumnReorder: (dragId: string, targetId: string) => void;
    onDragStart: (columnId: string) => void;
    onDragEnd: () => void;
    draggingColumnId: string | null;
    enableColumnPinning: boolean;
    pinnedOffsets: {
        left: Map<string, number>;
        right: Map<string, number>;
    };
    leftPinnedIds: string[];
    rightPinnedIds: string[];
}

export default function TableHeader<TData>({
                                               table,
                                               cellPadding,
                                               headerClass,
                                               enableColumnResize,
                                               enableColumnReorder,
                                               onColumnReorder,
                                               onDragStart,
                                               onDragEnd,
                                               draggingColumnId,
                                               enableColumnPinning,
                                               pinnedOffsets,
                                               leftPinnedIds,
                                               rightPinnedIds,
                                           }: Props<TData>) {
    return (
        <thead className={headerClass}>
        {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                    const canSort = header.column.getCanSort();
                    const alignClass = getAlignClass(header.column.columnDef.meta?.align);
                    const metaClass = header.column.columnDef.meta?.headerClassName ?? '';
                    const sortDirection = header.column.getIsSorted();
                    const isResizing = header.column.getIsResizing();
                    const isDragging = draggingColumnId === header.column.id;

                    const sizePx = header.getSize?.();
                    const pin = header.column.getIsPinned?.() ?? false;
                    const pinnedOffset = pin === 'left'
                        ? pinnedOffsets.left.get(header.column.id)
                        : pin === 'right'
                            ? pinnedOffsets.right.get(header.column.id)
                            : undefined;

                    const isLastLeftPinned =
                        pin === 'left' &&
                        leftPinnedIds.length > 0 &&
                        leftPinnedIds[leftPinnedIds.length - 1] === header.column.id;

                    const isFirstRightPinned =
                        pin === 'right' &&
                        rightPinnedIds[0] === header.column.id;

                    return (
                        <th
                            key={header.id}
                            className={`
                                group
                                ${cellPadding}
                                ${alignClass}
                                ${metaClass}
                                ${canSort ? 'select-none' : ''}
                                relative
                                ${isDragging ? 'opacity-50' : ''}
                                ${pin ? 'bg-surface sticky z-20' : ''}
                                
                                ${isLastLeftPinned ? `
                                  after:content-['']
                                  after:absolute
                                  after:top-0
                                  after:right-[-1px]
                                  after:h-full
                                  after:w-4
                                  after:bg-gradient-to-r
                                  after:from-black/15
                                  after:to-transparent
                                  after:pointer-events-none
                                ` : ''}
                            
                                ${isFirstRightPinned ? `
                                  before:content-['']
                                  before:absolute
                                  before:top-0
                                  before:left-[-10px]
                                  before:h-full
                                  before:w-4
                                  before:bg-gradient-to-l
                                  before:from-black/15
                                  before:to-transparent
                                  before:pointer-events-none
                                ` : ''}
                            `}
                            style={{
                                zIndex:
                                    pin === 'left' || pin === 'right'
                                        ? 30
                                        : 10,
                                ...(sizePx ? {width: `${sizePx}px`, minWidth: `${sizePx}px`} : {}),
                                ...(pin === 'left' && pinnedOffset !== undefined ? {left: pinnedOffset} : {}),
                                ...(pin === 'right' && pinnedOffset !== undefined ? {right: pinnedOffset} : {}),
                            }}
                        >
                            {/* Column hover background */}
                            <div
                                className={`
                                    pointer-events-none
                                    absolute inset-0
                                    bg-brand-soft/20
                                    opacity-0
                                    transition-opacity
                                    ${enableColumnResize ? 'group-hover:opacity-100' : ''}
                                    z-0
                                  `}
                            />
                            <div className="relative z-10 inline-flex items-center gap-1">
                                {enableColumnReorder && (
                                    <span
                                        draggable
                                        onDragStart={(e) => {
                                            // Important: prevent resize or sort from triggering
                                            e.stopPropagation();
                                            onDragStart(header.column.id);
                                        }}
                                        onDragEnd={onDragEnd}
                                        onDragOver={(e) => {
                                            if (!draggingColumnId || draggingColumnId === header.column.id) return;
                                            e.preventDefault();
                                        }}
                                        onDrop={(e) => {
                                            if (!draggingColumnId || draggingColumnId === header.column.id) return;

                                            const dragCol = table.getColumn(draggingColumnId);
                                            const targetCol = header.column;

                                            if (dragCol?.getIsPinned() !== targetCol.getIsPinned()) return;

                                            e.preventDefault();
                                            onColumnReorder(draggingColumnId, header.column.id);
                                            onDragEnd();
                                        }}
                                        className="cursor-grab text-ink-soft hover:text-ink active:cursor-grabbing mr-1" title="Перетягнути колонку">
                                        <MdDragIndicator size={14} />
                                    </span>
                                )}

                                <span
                                    onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                                    className={canSort ? 'cursor-pointer hover:text-ink' : ''}
                                >
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                </span>
                                {canSort && <TableSortIcon direction={sortDirection}/>}

                                {enableColumnPinning && header.column.getCanPin?.() && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const next = pin === 'left'
                                                ? 'right'
                                                : pin === 'right'
                                                    ? false
                                                    : 'left';
                                            header.column.pin(next);
                                        }}
                                        className="
                                            ml-1 rounded p-1 text-ink-soft
                                            hover:text-brand hover:bg-surface-muted
                                            focus:outline-none focus-visible:ring-1 focus-visible:ring-brand-ring
                                        "
                                        title={pin ? 'Відкріпити колонку' : 'Закріпити колонку'}
                                    >
                                        <FiMapPin
                                            size={14}
                                            className={pin ? 'text-brand rotate-45' : ''}
                                        />
                                    </button>
                                )}
                            </div>

                            {enableColumnResize && header.column.getCanResize() && (
                                <div
                                    onMouseDown={header.getResizeHandler()}
                                    onTouchStart={header.getResizeHandler()}
                                    className={`
                                        absolute top-0 right-0 h-full
                                        w-3
                                        z-20
                                        cursor-col-resize
                                        select-none touch-none
                                    
                                        after:content-['']
                                        after:absolute
                                        after:top-2 after:bottom-2
                                        after:left-1/2 after:-translate-x-1/2
                                        after:w-px
                                        after:bg-border/60
                                    
                                        hover:after:bg-brand
                                        ${isResizing ? 'after:bg-brand' : ''}
                                      `}
                                    aria-hidden
                                />
                            )}
                        </th>
                    );
                })}
            </tr>
        ))}
        </thead>
    );
}
