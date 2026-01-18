// hooks/useSelect.ts
import {useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState} from 'react'
import {useVirtualizer} from '@tanstack/react-virtual'

interface Params<T, V> {
    options: T[]
    value: V | null
    onChange: (value: V) => void

    getLabel: (item: T) => string
    getValue: (item: T) => V

    searchable?: boolean
    itemHeight: number
}

export function useSelect<T, V>({options, value, onChange, getLabel, getValue, searchable, itemHeight}: Params<T, V>) {
    const [open, setOpen] = useState(false)
    const [query, setQuery] = useState('')
    const [highlightedIndex, setHighlightedIndex] = useState(0)
    const [scrollEl, setScrollEl] = useState<HTMLDivElement | null>(null)

    // Ref-callback is used instead of useRef to get actual scroll container
    // after it appears in DOM (required for virtualizer + ResizeObserver)
    const listRef = useCallback((node: HTMLDivElement | null) => {
        if (node) setScrollEl(node)
    }, [])

    const dropdownRef = useRef<HTMLDivElement>(null)

    /* =========================
    Filter
    ========================= */
    const filteredOptions = useMemo(() => {
        if (!searchable || !query.trim()) return options
        return options.filter(o =>
            getLabel(o).toLowerCase().includes(query.toLowerCase())
        )
    }, [options, query, searchable, getLabel])


    /* =========================
    Virtualizer
    Renders only visible items for large option lists
    ========================= */
    const virtualizer = useVirtualizer({
        count: filteredOptions.length,
        getScrollElement: () => scrollEl,
        estimateSize: () => itemHeight,
        overscan: 8, // extra items for smoother scroll
    })

    /* =========================
    Re-measure virtualizer when dropdown opens
    Needed because dropdown is rendered in Portal
    ========================= */
    useLayoutEffect(() => {
        if (!open || !scrollEl) return

        const ro = new ResizeObserver(virtualizer.measure)

        ro.observe(scrollEl)
        virtualizer.measure()

        return () => ro.disconnect()
    }, [open, scrollEl])

    /* =========================
    Sync value → highlight
    ========================= */
    useEffect(() => {
        if (!open || value == null) return

        const index = filteredOptions.findIndex(
            o => getValue(o) === value
        )

        if (index >= 0) {
            setHighlightedIndex(index)
            virtualizer.scrollToIndex(index, {align: 'start'})
        }
    }, [open, value, filteredOptions, getValue, virtualizer])

    /* =========================
    Clamp highlight
    ========================= */
    useEffect(() => {
        setHighlightedIndex(i =>
            Math.max(0, Math.min(i, filteredOptions.length - 1))
        )
    }, [filteredOptions.length])

    /* =========================
    Keyboard navigation (Arrow / Enter / Escape)
    ========================= */
    useEffect(() => {
        if (!open) return

        const onKey = (e: KeyboardEvent) => {
            // ЛОКАЛЬНІСТЬ
            if (!dropdownRef.current?.contains(e.target as Node)) return

            if (e.key === 'ArrowDown') {
                e.preventDefault()
                setHighlightedIndex(i =>
                    Math.min(i + 1, filteredOptions.length - 1)
                )
            }

            if (e.key === 'ArrowUp') {
                e.preventDefault()
                setHighlightedIndex(i =>
                    Math.max(i - 1, 0)
                )
            }

            if (e.key === 'Enter') {
                e.preventDefault()
                const item = filteredOptions[highlightedIndex]
                if (item) {
                    onChange(getValue(item))
                    setOpen(false)
                }
            }

            if (e.key === 'Escape') {
                setOpen(false)
            }
        }

        document.addEventListener('keydown', onKey)
        return () => document.removeEventListener('keydown', onKey)
    }, [open, filteredOptions, highlightedIndex, onChange, getValue])

    /* =========================
    Scroll -> highlight
    ========================= */
    useEffect(() => {
        if (!open) return
        virtualizer.scrollToIndex(highlightedIndex, {align: 'auto'})
    }, [highlightedIndex])

    /* =========================
    Reset query
    ========================= */
    useEffect(() => {
        if (!open) setQuery('')
    }, [open])

    return {
        open, setOpen,

        query, setQuery,

        highlightedIndex, setHighlightedIndex,

        filteredOptions, dropdownRef, listRef, virtualizer,
    }
}
