// ui/Select

/**
 * Base Select component.
 *
 * Planned extensions:
 * - AsyncSelect (remote options)
 * - MultiSelect
 * - Context / Actions menus
 */


import {useEffect} from "react";
import Portal from "./Portal";
import Spinner from './Spinner';
import {useSelect} from '../hooks/useSelect';
import {useFloating, flip, shift, autoUpdate, size} from '@floating-ui/react'
import Input from "./Input";

interface Props<T, V = number | string> {
    value: V | null;
    onChange: (value: V) => void;

    options: T[];
    getLabel: (item: T) => string;
    getValue: (item: T) => V;

    placeholder?: string;
    searchable?: boolean;

    maxVisibleItems?: number;
    itemHeight?: number;

    invalid?: boolean;
    error?: string;
    loading?: boolean;
    loadingText?: string;
    disabled?: boolean;
}

const DEFAULT_ITEM_HEIGHT = 32;
const DEFAULT_MAX_VISIBLE_ITEMS = 8;

export default function Select<T, V extends string | number = number>({
                                                                          value, onChange, options,
                                                                          getLabel, getValue,
                                                                          placeholder = 'Оберіть значення', searchable,
                                                                          maxVisibleItems, itemHeight,
                                                                          invalid, error, loading, loadingText = 'Завантаження…', disabled
                                                                      }: Props<T, V>) {
    const resolvedItemHeight = itemHeight ?? DEFAULT_ITEM_HEIGHT;
    const resolvedMaxVisibleItems = maxVisibleItems ?? DEFAULT_MAX_VISIBLE_ITEMS;

    const { open, setOpen, query, setQuery, filteredOptions, highlightedIndex,
        setHighlightedIndex, dropdownRef, listRef, virtualizer
    } = useSelect<T, V>({
        options, value, onChange, getLabel, getValue, searchable, itemHeight: resolvedItemHeight,
    })

    const visibleCount = Math.min(filteredOptions.length, resolvedMaxVisibleItems);
    const listHeight = visibleCount * resolvedItemHeight;

    const isDisabled = disabled || loading;

    const selected = value != null
        ? options.find(o => getValue(o) === value)
        : null;

    // Floating UI handles adaptive positioning (top/bottom) and viewport overflow
    const {refs, floatingStyles, placement} = useFloating({
        open,
        onOpenChange: setOpen,
        placement: 'bottom-start',
        whileElementsMounted: autoUpdate,
        middleware: [
            flip(),
            shift({padding: 8}),
            size({
                apply({rects, elements}) {
                    Object.assign(elements.floating.style, {
                        width: `${rects.reference.width}px`,
                    })
                },
            }),
        ],
    })

    // Determines whether dropdown is rendered above or below the trigger
    const isTop = placement.startsWith('top');

    /* =========================
    Close dropdown on outside click
    (pointerdown is used to catch events before focus changes)
   ========================= */
    useEffect(() => {
        if (!open) return

        const onPointerDown = (e: PointerEvent) => {
            const target = e.target as Node

            const referenceEl = refs.reference.current

            if (referenceEl instanceof HTMLElement && referenceEl.contains(target)) {
                return
            }

            if (dropdownRef.current?.contains(target)) {
                return
            }

            setOpen(false)
        }

        document.addEventListener('pointerdown', onPointerDown)
        return () => document.removeEventListener('pointerdown', onPointerDown)
    }, [open])

    const listContent = loading || filteredOptions.length === 0 ? (
        <div className="px-3 py-2 text-sm text-gray-400">
            {loading ? loadingText : 'Нічого не знайдено'}
        </div>
    ) : (
        <div
            style={{
                height: virtualizer.getTotalSize(),
                position: 'relative',
            }}
        >
            {virtualizer.getVirtualItems().map(vItem => {
                const opt = filteredOptions[vItem.index]
                if (!opt) return null

                const isSelected = selected && getValue(opt) === getValue(selected)
                const isHighlighted = vItem.index === highlightedIndex

                return (
                    <div
                        key={vItem.key}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: vItem.size,
                            transform: `translateY(${vItem.start}px)`,
                        }}
                        onMouseEnter={() =>
                            setHighlightedIndex(vItem.index)
                        }
                        onClick={() => {
                            onChange(getValue(opt));
                            setOpen(false);
                        }}
                        className={`
                            px-3 flex items-center text-sm cursor-pointer
                            transition-colors
                            
                            hover:bg-gray-50
                            
                            ${isHighlighted ? 'bg-blue-50' : ''}
                            ${isSelected ? 'bg-blue-100 text-blue-900 font-medium' : ''}
                        `}
                    >
                        {getLabel(opt)}
                    </div>
                );
            })}
        </div>
    );

    return (
        <div className="flex flex-col gap-1 relative">
            {/* ===== Trigger ===== */}
            <button
                ref={refs.setReference}
                type="button"
                disabled={isDisabled}
                onClick={() => setOpen(v => !v)}
                className={`
                    h-8 px-3 pr-9
                    flex items-center justify-between
                    text-sm rounded border
                    transition outline-none

                    ${invalid
                        ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                        : 'border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-400'}

                    ${isDisabled
                        ? 'bg-gray-100 cursor-not-allowed text-gray-400'
                        : 'bg-white'}
                `}
            >
                <span className={selected ? '' : 'text-gray-400'}>
                    {selected ? getLabel(selected) : placeholder}
                </span>

                <span className="absolute right-3 text-gray-400">
                    {loading ? (
                        <Spinner size={16}/>
                    ) : (
                        <svg
                            className={`transition-transform ${open ? 'rotate-180' : ''}`}
                            width="16"
                            height="16"
                            viewBox="0 0 20 20"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path d="M6 8l4 4 4-4"/>
                        </svg>
                    )}
                </span>
            </button>

            {/* ===== Dropdown ===== */}
            {open && (
                <Portal>
                    <div
                        ref={(node) => {
                            refs.setFloating(node)
                            dropdownRef.current = node
                        }}
                        style={floatingStyles}
                        className="
                            rounded-md border border-gray-200 bg-white
                            shadow-lg shadow-black/5
                            flex flex-col overflow-hidden
                        "
                    >
                        {/* TOP */}
                        {isTop && (
                            <div
                                ref={listRef}
                                className="overflow-auto"
                                style={{ height: listHeight }}
                            >
                                {listContent}
                            </div>
                        )}

                        {searchable && (
                            <div className={`${isTop ? 'border-t' : 'border-b'} border-gray-200/60`}>
                            <Input
                                    autoFocus
                                    value={query}
                                    onChange={e => {
                                        setQuery(e.target.value)
                                        setHighlightedIndex(0)
                                    }}
                                    placeholder="Пошук…"
                                    className="border-0 rounded"
                                />
                            </div>
                        )}

                        {/* BOTTOM */}
                        {!isTop && (
                            <div
                                ref={listRef}
                                className="overflow-auto"
                                style={{ height: listHeight }}
                            >
                                {listContent}
                            </div>
                        )}
                    </div>
                </Portal>
            )}

            {/* ===== Error ===== */}
            {error && <div className="text-xs text-red-600">{error}</div>}
        </div>
    );
}
