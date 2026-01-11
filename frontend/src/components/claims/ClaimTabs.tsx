import { useLayoutEffect, useRef, useState } from 'react';

import type { Claim } from '../../types/claim';
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

    const containerRef = useRef<HTMLDivElement>(null);
    const indicatorRef = useRef<HTMLDivElement>(null);

    const updateIndicator = () => {
        const container = containerRef.current;
        const indicator = indicatorRef.current;
        if (!container || !indicator) return;

        const activeBtn = container.querySelector<HTMLButtonElement>(
            `[data-key="${active}"]`
        );
        if (!activeBtn) return;

        indicator.style.width = `${activeBtn.offsetWidth}px`;
        indicator.style.transform = `translateX(${activeBtn.offsetLeft}px)`;
    };

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
    }, [active]);


    return (
        <div className="space-y-4">
            {/* Tabs header */}
            <div className="sticky top-0 z-10 bg-gray-50">
                <div className="relative border-b">
                    <div
                        ref={containerRef}
                        className="flex flex-wrap gap-x-2 gap-y-1 min-w-0"
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
                                        rounded-md
                                        transition-all duration-150
                                        ${isActive
                                            ? 'text-blue-600 font-medium'
                                            : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'}
                                            `}
                                >
                                    <Icon
                                        size={16}
                                        className={`
                                            transition-colors
                                            ${isActive 
                                                ? 'text-blue-600' 
                                                : 'text-gray-400 group-hover:text-blue-600'}
                                        `}
                                    />
                                    <span>{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* underline */}
                    <div
                        ref={indicatorRef}
                        className="absolute bottom-0 h-0.5 bg-blue-600"
                        style={{
                            transition: 'transform 250ms ease, width 250ms ease',
                        }}
                    />
                </div>
            </div>

            {/* Content */}
            <div
                key={active}
                className="p-4 rounded bg-white min-w-0 overflow-x-hidden"
                style={{animation: 'fadeIn 200ms ease-out'}}
            >
                {active === 'details' && <ClaimDetailsTab claim={claim} />}
                {active === 'history' && <ClaimHistoryTab claimId={claim.id} />}
                {active === 'employees' && <ClaimEmployeesTab claimId={claim.id} />}
                {active === 'parts' && <ClaimPartsTab claimId={claim.id} />}
                {active === 'delivery' && <ClaimDeliveryTab claimId={claim.id} />}
                {active === 'invoice' && <ClaimInvoiceTab claimId={claim.id} />}
                {active === 'payment' && <ClaimPaymentTab claimId={claim.id} />}
            </div>

            {/* inline keyframes */}
            <style>
                {`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(2px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                `}
            </style>
        </div>
    );
}
