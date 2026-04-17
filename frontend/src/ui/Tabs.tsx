import { useCallback, useLayoutEffect, useRef } from 'react';
import type { IconType } from 'react-icons';

export interface TabItem {
    key: string;
    label: string;
    icon?: IconType;
}

interface Props {
    tabs: TabItem[];
    active: string;
    onChange: (key: string) => void;

    children: React.ReactNode;
}

export default function Tabs({
                                 tabs,
                                 active,
                                 onChange,
                                 children
                             }: Props) {

    const activeContentRef = useRef<HTMLSpanElement | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const indicatorRef = useRef<HTMLDivElement>(null);

    const updateIndicator = useCallback(() => {
        const container = containerRef.current;
        const indicator = indicatorRef.current;
        const activeContent = activeContentRef.current;

        if (!container || !indicator || !activeContent) return;

        const rect = activeContent.getBoundingClientRect();
        const parentRect = container.getBoundingClientRect();

        indicator.style.width = `${rect.width}px`;
        indicator.style.transform = `translateX(${rect.left - parentRect.left}px)`;
    }, []);

    useLayoutEffect(() => {
        updateIndicator();

        const ro = new ResizeObserver(updateIndicator);
        if (containerRef.current) ro.observe(containerRef.current);

        window.addEventListener('resize', updateIndicator);

        return () => {
            ro.disconnect();
            window.removeEventListener('resize', updateIndicator);
        };
    }, [updateIndicator]);

    useLayoutEffect(() => {
        requestAnimationFrame(updateIndicator);
    }, [active, updateIndicator]);

    return (
        <div className="rounded-xl border border-border bg-surface shadow-sm overflow-hidden">

            {/* HEADER */}
            <div className="sticky top-0 z-10 bg-surface">
                <div className="relative border-b border-border">
                    <div
                        ref={containerRef}
                        className="flex flex-wrap gap-x-1 gap-y-1"
                    >
                        {tabs.map(tab => {
                            const Icon = tab.icon;
                            const isActive = active === tab.key;

                            return (
                                <button
                                    key={tab.key}
                                    onClick={() => onChange(tab.key)}
                                    className={`
                                        group flex items-center gap-2
                                        px-4 py-2 text-sm rounded-t-md
                                        transition-all
                                        ${isActive
                                        ? 'text-brand font-semibold bg-brand-soft'
                                        : 'text-ink-muted hover:text-brand hover:bg-brand-soft'}
                                    `}
                                >
                                    <span
                                        ref={isActive ? activeContentRef : undefined}
                                        className="inline-flex items-center gap-2"
                                    >
                                        {Icon && (
                                            <Icon
                                                size={16}
                                                className={`
                                                    ${isActive
                                                    ? 'text-brand'
                                                    : 'text-ink-soft group-hover:text-brand'}
                                                `}
                                            />
                                        )}
                                        {tab.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* indicator */}
                    <div
                        ref={indicatorRef}
                        className="absolute bottom-0 h-0.5 bg-brand transition-all duration-200"
                    />
                </div>
            </div>

            {/* CONTENT */}
            <div className="p-4 animate-[fade-up_250ms_ease-out_both]">
                {children}
            </div>
        </div>
    );
}