import {useEffect, useMemo, useState} from 'react';
import { getUsedPartsByClaim } from '../../../api/usedPart';
import type { UsedPart } from '../../../types/usedPart.ts';

interface Props {
    claimId: number;
}

const format = (v: number) =>
    v.toLocaleString('uk-UA', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

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
            <div className="text-sm text-gray-500">
                Запчастини не використовувались
            </div>
        );
    }

    return (
        <div className="relative space-y-4">
            <div className="overflow-x-auto max-h-[60vh]">
                <table className="w-full text-sm border rounded">
                    <thead className="bg-gray-100 text-left sticky top-0 z-10">
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
                            <tr key={p.partId} className="hover:bg-gray-50">
                                <td className="p-2 border font-medium">
                                    {p.partName}
                                </td>

                                <td className="p-2 border text-gray-600">
                                    {p.partCode}
                                </td>

                                <td className="p-2 border text-right font-mono">
                                    {formatQty(p.quantity)} {p.unitName}
                                </td>

                                <td className="p-2 border text-right font-mono">
                                    {format(p.unitPrice)}
                                </td>

                                <td className="p-2 border text-right font-mono font-semibold">
                                    {format(total)}
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>

            {/* 🔢 Sticky summary */}
            <div className="sticky bottom-0 z-20 bg-white border-t">
                <div className="flex justify-end px-4 py-3 text-sm">
                    <div className="flex gap-4 rounded bg-gray-50 px-4 py-2 border shadow-sm">
                    <span className="text-gray-600">
                        Всього запчастин:
                    </span>
                        <span className="font-semibold font-mono">
                        {format(totalSum)}
                    </span>
                    </div>
                </div>
            </div>
        </div>
    );
}