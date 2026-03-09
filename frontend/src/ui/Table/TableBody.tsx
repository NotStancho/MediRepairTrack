// ui/Table/TableBody.tsx
import  { type ReactNode } from 'react';
import { flexRender, type Row } from '@tanstack/react-table';
import { useMemo } from 'react';
import {useVirtualizer } from '@tanstack/react-virtual';
import { getAlignClass } from './tableUtils';
import * as React from "react";

interface Props<TData> {
    rows: Row<TData>[];
    virtualization?: {
        estimateSize?: number;
        overscan?: number;
    };
    scrollElementRef?: React.RefObject<HTMLElement | null>;
    columnCount: number;
    cellPadding: string;
    bodyRowBase: string;
    emptyState: ReactNode;
    loading?: boolean;
    onRowClick?: (row: Row<TData>) => void;
    rowClassName?: (row: Row<TData>) => string | undefined;
    pinnedOffsets: {
        left: Map<string, number>;
        right: Map<string, number>;
    };
    leftPinnedIds: string[];
    rightPinnedIds: string[];
}

export default function TableBody<TData>({
    rows,
    virtualization,
    scrollElementRef,
    columnCount,
    cellPadding,
    bodyRowBase,
    emptyState,
    loading,
    onRowClick,
    rowClassName,
    pinnedOffsets,
    leftPinnedIds,
    rightPinnedIds,
}: Props<TData>) {

    // eslint-disable-next-line react-hooks/incompatible-library
    const rowVirtualizer = useVirtualizer({
        count: rows.length,
        getScrollElement: () => scrollElementRef?.current ?? null,
        estimateSize: () => virtualization?.estimateSize ?? 48,
        overscan: virtualization?.overscan ?? 10,
        enabled: !!virtualization && !!scrollElementRef?.current,
    });

    const virtualRows = virtualization ? rowVirtualizer.getVirtualItems() : null;

    const paddingTop = virtualRows?.[0]?.start ?? 0;
    const paddingBottom = virtualRows && virtualRows.length
        ? rowVirtualizer.getTotalSize() - virtualRows[virtualRows.length - 1].end
        : 0;


    const content = useMemo(() => {
        if (loading) {
            return Array.from({ length: 6 }).map((_, idx) => (
                <tr key={`loading-${idx}`} className="animate-pulse">
                    <td className={`${cellPadding} border-b border-border`} colSpan={columnCount}>
                        <div className="h-4 w-3/4 rounded bg-surface-muted" />
                    </td>
                </tr>
            ));
        }

        if (!rows.length) {
            return (
                <tr>
                    <td colSpan={columnCount} className={`${cellPadding} text-center`}>
                        {emptyState}
                    </td>
                </tr>
            );
        }

        const renderRow = (row: Row<TData>, key: string | number) => (
            <tr
                key={key}
                className={`${bodyRowBase} ${rowClassName?.(row) ?? ''} ${onRowClick ? 'cursor-pointer' : ''}`}
                onClick={() => onRowClick?.(row)}
            >
                {row.getVisibleCells().map(cell => {
                    const alignClass = getAlignClass(cell.column.columnDef.meta?.align);
                    const metaClass = cell.column.columnDef.meta?.cellClassName ?? '';
                    const pin = cell.column.getIsPinned?.() ?? false;
                    const pinnedOffset = pin === 'left'
                        ? pinnedOffsets.left.get(cell.column.id)
                        : pin === 'right'
                            ? pinnedOffsets.right.get(cell.column.id)
                            : undefined;

                    const isLastLeftPinned =
                        pin === 'left' &&
                        leftPinnedIds[leftPinnedIds.length - 1] === cell.column.id;

                    const isFirstRightPinned =
                        pin === 'right' &&
                        rightPinnedIds[0] === cell.column.id;

                    return (
                        <td
                            key={cell.id}
                            className={`
                                ${cellPadding} ${alignClass} ${metaClass}
                                ${pin ? 'bg-surface sticky' : ''}
                                
                                ${isLastLeftPinned ? `
                                  after:content-['']
                                  after:absolute
                                  after:top-0
                                  after:right-[-1px]
                                  after:h-full
                                  after:w-4
                                  after:pointer-events-none
                                  after:bg-gradient-to-r
                                  after:from-black/10
                                  after:to-transparent
                                ` : ''}
                                
                                ${isFirstRightPinned ? `
                                  before:content-['']
                                  before:absolute
                                  before:top-0
                                  before:left-[-10px]
                                  before:h-full
                                  before:w-4
                                  before:pointer-events-none
                                  before:bg-gradient-to-l
                                  before:from-black/10
                                  before:to-transparent
                                ` : ''}
                            `}
                            style={{
                                zIndex:
                                    pin === 'left'
                                        ? 20
                                        : pin === 'right'
                                            ? 20
                                            : undefined,
                                ...(pin === 'left' && pinnedOffset !== undefined ? { left: pinnedOffset } : {}),
                                ...(pin === 'right' && pinnedOffset !== undefined ? { right: pinnedOffset } : {}),
                            }}
                        >
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                    );
                })}
            </tr>
        );

        if (!virtualization || !virtualRows) {
            return rows.map(row => renderRow(row, row.id));
        }

        return (
            <>
                {paddingTop > 0 && (
                    <tr style={{ height: paddingTop }}>
                        <td colSpan={columnCount} />
                    </tr>
                )}

                {virtualRows.map(vr => {
                    const row = rows[vr.index];
                    return row ? renderRow(row, `vr-${vr.key}`) : null;
                })}

                {paddingBottom > 0 && (
                    <tr style={{ height: paddingBottom }}>
                        <td colSpan={columnCount} />
                    </tr>
                )}
            </>
        );
    }, [loading, rows, virtualization, virtualRows, paddingTop, columnCount, paddingBottom, cellPadding, emptyState, bodyRowBase, rowClassName, onRowClick, pinnedOffsets.left, pinnedOffsets.right, leftPinnedIds, rightPinnedIds]);

    return <tbody>{content}</tbody>;
}
