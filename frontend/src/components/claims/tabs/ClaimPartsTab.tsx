import {useEffect, useMemo, useState} from 'react';
import { getUsedPartsByClaim } from '../../../api/usedPart';
import type { UsedPart } from '../../../types/usedPart';
import { formatMoney } from '../../../utils/moneyFormat';

interface Props {
    claimId: number;
}

const formatQty = (v: number) =>
    Number.isInteger(v) ? v.toString() : v.toString();

export default function ClaimPartsTab({ claimId }: Props) {
    const [items, setItems] = useState<UsedPart[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getUsedPartsByClaim(claimId)
            .then(setItems)
            .finally(() => setLoading(false));
    }, [claimId]);

    const totalSum = useMemo(
        () =>
            items.reduce(
                (sum, p) => sum + p.quantity * p.unitPrice,
                0
            ),
        [items]
    );

    if (loading) {
        return <div>Завантаження запчастин…</div>;
    }

    if (!items.length) {
        return (
            <div className="text-sm text-ink-muted">
                Запчастини не використовувались
            </div>
        );
    }

    return (
        <div className="relative space-y-4">
            <div className="overflow-x-auto">
                <table className="w-full text-sm border border-border rounded-lg">
                    <thead className="bg-surface-muted text-left sticky top-0 z-10">
                    <tr>
                        <th className="p-2 border">Запчастина</th>
                        <th className="p-2 border">Код</th>
                        <th className="p-2 border text-right">Кількість</th>
                        <th className="p-2 border text-right">Ціна</th>
                        <th className="p-2 border text-right">Сума</th>
                    </tr>
                    </thead>

                    <tbody>
                    {items.map(p => {
                        const total = p.quantity * p.unitPrice;

                        return (
                            <tr key={p.partId} className="hover:bg-surface-muted">
                                <td className="p-2 border font-medium">
                                    {p.partName}
                                </td>

                                <td className="p-2 border text-ink-muted">
                                    {p.partCode}
                                </td>

                                <td className="p-2 border text-right font-mono">
                                    {formatQty(p.quantity)} {p.unitName}
                                </td>

                                <td className="p-2 border text-right font-mono">
                                    {formatMoney(p.unitPrice)}
                                </td>

                                <td className="p-2 border text-right font-mono font-semibold">
                                    {formatMoney(total)}
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>

            {/* 🔢 Sticky summary */}
            <div className="sticky bottom-0 z-20 bg-surface border-t border-border">
                <div className="flex justify-end px-4 py-3 text-sm">
                    <div className="flex gap-4 rounded bg-surface-muted px-4 py-2 border border-border shadow-sm">
                    <span className="text-ink-muted">
                        Всього запчастин:
                    </span>
                        <span className="font-semibold font-mono">
                        {formatMoney(totalSum)}
                    </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
