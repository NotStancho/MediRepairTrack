import { useEffect, useState } from 'react';
import { getDeliveriesByClaim } from '../../../api/delivery';
import type { Delivery } from '../../../types/delivery';
import { DELIVERY_PROVIDER_LABELS, DELIVERY_STATUS_LABELS, DELIVERY_TYPE_LABELS } from '../../../utils/deliveryLabels';
import { formatMoney } from '../../../utils/moneyFormat';

interface Props {
    claimId: number;
}

export default function ClaimDeliveryTab({ claimId }: Props) {
    const [items, setItems] = useState<Delivery[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getDeliveriesByClaim(claimId)
            .then(setItems)
            .finally(() => setLoading(false));
    }, [claimId]);

    if (loading) return <div>Завантаження доставок…</div>;

    if (!items.length)
        return <div className="text-sm text-gray-500">Доставки відсутні</div>;

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm border rounded">
                <thead className="bg-gray-100 text-left">
                <tr>
                    <th className="p-2 border">Тип</th>
                    <th className="p-2 border">Провайдер</th>
                    <th className="p-2 border">Статус</th>
                    <th className="p-2 border">Трек / Дистанція</th>
                    <th className="p-2 border text-right">Тариф</th>
                    <th className="p-2 border text-right">Вартість</th>
                </tr>
                </thead>

                <tbody>
                {items.map(d => {
                    const isEngineer = d.type === 'ENGINEER_ON_SITE';

                    const total =
                        d.price ??
                        (d.distanceKm && d.pricePerUnit
                            ? d.distanceKm * d.pricePerUnit
                            : null);

                    return (
                        <tr key={d.id} className="hover:bg-gray-50">
                            <td className="p-2 border">
                                {DELIVERY_TYPE_LABELS[d.type]}
                            </td>

                            <td className="p-2 border">
                                {DELIVERY_PROVIDER_LABELS[d.provider]}
                            </td>

                            <td className="p-2 border">
                                {DELIVERY_STATUS_LABELS[d.status]}
                            </td>

                            <td className="p-2 border text-sm text-gray-600">
                                {isEngineer
                                    ? `${d.distanceKm} км`
                                    : d.trackingCode ?? '-'}
                            </td>

                            <td className="p-2 border text-right font-mono">
                                {d.type === 'ENGINEER_ON_SITE' && d.pricePerUnit != null
                                    ? `${formatMoney(d.pricePerUnit)} / км`
                                    : 'Фіксована'}
                            </td>

                            <td className="p-2 border text-right font-mono font-semibold">
                                {total != null ? formatMoney(total) : '-'}
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
}
