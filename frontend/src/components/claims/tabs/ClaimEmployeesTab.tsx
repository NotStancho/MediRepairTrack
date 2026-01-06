import {useEffect, useState} from 'react';
import {getClaimEmployees} from '../../../api/claimEmployee';
import type {ClaimEmployee} from '../../../types/claimEmployee';
import {ROLE_IN_CLAIM_COLORS, ROLE_IN_CLAIM_LABELS } from "../../../utils/roleInClaimLabels.ts";

interface Props {
    claimId: number;
}

export default function ClaimEmployeesTab({claimId}: Props) {
    const [items, setItems] = useState<ClaimEmployee[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getClaimEmployees(claimId)
            .then(setItems)
            .finally(() => setLoading(false));
    }, [claimId]);

    if (loading) return <div>Завантаження працівників…</div>;
    if (!items.length)
        return <div className="text-sm text-gray-500">Працівники не призначені</div>;

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm border rounded">
                <thead className="bg-gray-100 text-left">
                <tr>
                    <th className="p-2 border">Працівник</th>
                    <th className="p-2 border">Посада</th>
                    <th className="p-2 border">Роль у заявці</th>
                    <th className="p-2 border">Години</th>
                    <th className="p-2 border">Примітки</th>
                </tr>
                </thead>
                <tbody>
                {items.map(e => (
                    <tr key={e.employeeId}>
                        <td className="p-2 border font-medium">
                            {e.lastName} {e.firstName}
                        </td>
                        <td className="p-2 border">{e.position}</td>
                        {/*<td className="p-2 border">{e.roleInClaim}</td>*/}
                        <td className="p-2 border">
                                <span
                                    className={`
                                        inline-flex items-center
                                        px-2 py-0.5
                                        rounded-full
                                        text-xs font-medium
                                        ${ROLE_IN_CLAIM_COLORS[e.roleInClaim]}
                                    `}
                                >
                                    {ROLE_IN_CLAIM_LABELS[e.roleInClaim]}
                                </span>
                        </td>
                        <td className="p-2 border ">
                            {e.hoursWorked ?? '—'}
                        </td>
                        <td className="p-2 border text-gray-600 max-w-xs truncate">
                            {e.notes ? (<span className="whitespace-pre-line">{e.notes}</span>) : (
                                <span className="text-gray-400">-</span>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
