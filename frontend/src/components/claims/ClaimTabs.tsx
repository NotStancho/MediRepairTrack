import {useCallback, useLayoutEffect, useRef, useState} from 'react';

import type { Claim } from '../../types/claim/claim';
import ClaimDetailsTab from "./tabs/ClaimDetailsTab.tsx";
import ClaimHistoryTab from "./tabs/ClaimHistoryTab.tsx";
import ClaimEmployeesTab from "./tabs/ClaimEmployeesTab";
import ClaimPartsTab from "./tabs/ClaimPartsTab";
import ClaimDeliveryTab from "./tabs/ClaimDeliveryTab";
import ClaimInvoiceTab from "./tabs/ClaimInvoiceTab";
import ClaimPaymentTab from "./tabs/ClaimPaymentTab";

import type {IconType} from "react-icons";
import { FiInfo, FiClock, FiUsers, FiPackage, FiTruck, FiFileText, FiCreditCard } from 'react-icons/fi';

interface Props {
    claim: Claim;
}

const tabs: { key: string; label: string; icon: IconType }[] = [
    { key: 'details', label: 'Деталі', icon: FiInfo },
    { key: 'history', label: 'Історія', icon: FiClock },
    { key: 'employees', label: 'Працівники', icon: FiUsers },
    { key: 'parts', label: 'Запчастини', icon: FiPackage },
    { key: 'delivery', label: 'Доставка', icon: FiTruck },
    { key: 'invoice', label: 'Рахунок', icon: FiFileText },
    { key: 'payment', label: 'Оплата', icon: FiCreditCard },
];

export default function ClaimTabs({ claim }: Props) {
    const [active, setActive] = useState('details');

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

        const container = containerRef.current;
        if (!container) return;

        // ResizeObserver — реагує на wrap / resize контейнера
        const ro = new ResizeObserver(() => {
            updateIndicator();
        });

        ro.observe(container);

        // Fallback: window resize
        window.addEventListener('resize', updateIndicator);

        return () => {
            ro.disconnect();
            window.removeEventListener('resize', updateIndicator);
        };
    }, [updateIndicator]);

    useLayoutEffect(() => {
        requestAnimationFrame(() => {
            updateIndicator();
        });
    }, [active, updateIndicator]);

    return (
        <div>
            <div className="rounded-xl border border-border bg-surface shadow-sm overflow-hidden">
                {/* Tabs header */}
                <div className="sticky top-0 z-10 bg-surface">
                    <div className="relative border-b border-border">
                        <div
                            ref={containerRef}
                            className="flex flex-wrap gap-x-1 gap-y-1 min-w-0"
                        >
                            {tabs.map(tab => {
                                const Icon = tab.icon;
                                const isActive = active === tab.key;

                                return (
                                    <button
                                        key={tab.key}
                                        data-key={tab.key}
                                        onClick={() => setActive(tab.key)}
                                        className={`
                                        group
                                        flex items-center gap-2
                                        px-4 py-2 text-sm
                                        rounded-t-md
                                        transition-all duration-150
                                        ${isActive
                                            ? 'text-brand font-semibold bg-brand-soft'
                                            : 'text-ink-muted hover:text-brand hover:bg-brand-soft'}
                                            `}
                                    >
                                        <span
                                            ref={isActive ? activeContentRef : undefined}
                                            className="inline-flex items-center gap-2"
                                        >
                                            <Icon
                                                size={16}
                                                className={`
                                                    transition-colors
                                                    ${isActive
                                                        ? 'text-brand'
                                                        : 'text-ink-soft group-hover:text-brand'}
                                                    `}
                                            />
                                        <span>{tab.label}</span>
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* underline */}
                        <div
                            ref={indicatorRef}
                            className="absolute bottom-0 h-0.5 bg-brand transition-[transform,width] duration-200"
                        />
                    </div>
                </div>

                {/* Content */}
                <div className="p-4 min-w-0 overflow-x-hidden animate-[fade-up_250ms_ease-out_both]">
                    {active === 'details' && <ClaimDetailsTab claim={claim}/>}
                    {active === 'history' && <ClaimHistoryTab claimId={claim.id}/>}
                    {active === 'employees' && <ClaimEmployeesTab claimId={claim.id}/>}
                    {active === 'parts' && <ClaimPartsTab claimId={claim.id}/>}
                    {active === 'delivery' && <ClaimDeliveryTab claimId={claim.id}/>}
                    {active === 'invoice' && <ClaimInvoiceTab claimId={claim.id}/>}
                    {active === 'payment' && <ClaimPaymentTab claimId={claim.id}/>}
                </div>
            </div>
        </div>
    );
}
