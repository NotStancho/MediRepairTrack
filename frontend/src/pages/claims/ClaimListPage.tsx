import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';

import {useAuth} from '../../context/AuthContext';
import {getAllClaims, getClaimsByClient} from '../../api/claim';
import {getAssignedActiveClaims} from '../../api/claimEmployee';

import type {Claim} from '../../types/claim/claim';
import type {AssignedActiveClaim} from "../../types/claim/assignedClaim";

import {CLAIM_STATUS_LABELS, REPAIR_TYPE_LABELS, STATUS_COLORS} from '../../utils/claimLabels';
import {ROLE_IN_CLAIM_LABELS, ROLE_IN_CLAIM_COLORS} from '../../utils/roleInClaimLabels';

import Button from '../../ui/Button';

import {formatDateTime} from '../../utils/dateFormat';

export default function ClaimListPage() {
    const {user} = useAuth();
    const navigate = useNavigate();

    const [claims, setClaims] = useState<Claim[]>([]);
    const [assignedClaims, setAssignedClaims] = useState<AssignedActiveClaim[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        setLoading(true);

        if (user.role === 'CLIENT') {
            getClaimsByClient(user.clientId!)
                .then(setClaims)
                .finally(() => setLoading(false));

        } else if (user.role === 'EMPLOYEE' && user.position === 'SERVICE_ENGINEER') {
            getAssignedActiveClaims(user.employeeId!)
                .then(setAssignedClaims)
                .finally(() => setLoading(false));

        } else {
            getAllClaims()
                .then(setClaims)
                .finally(() => setLoading(false));
        }
    }, [user]);

    const openClaim = (id: number) => {
        if (user?.role === 'CLIENT') navigate(`/client/claims/${id}`);
        else if (user?.role === 'EMPLOYEE') navigate(`/employee/claims/${id}`);
        else navigate(`/claims/${id}`);
    };

    if (loading) return <div>Завантаження заявок…</div>;
    if (!user) return null;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">
                    {user?.role === 'CLIENT'
                        ? 'Мої заявки'
                        : user?.role === 'EMPLOYEE' && user.position === 'SERVICE_ENGINEER'
                            ? 'Призначені заявки'
                            : 'Всі заявки'}
                </h1>

                {user.role === 'CLIENT' && (
                    <Button
                        variant="primary"
                        onClick={() => navigate('/client/claims/new')}
                    >
                        + Подати заявку
                    </Button>
                )}
            </div>

            {user.role === 'EMPLOYEE' && user.position === 'SERVICE_ENGINEER' ? (
                assignedClaims.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <h2 className="text-lg font-semibold text-gray-800">
                            Наразі немає призначених заявок
                        </h2>
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2 border">№</th>
                            <th className="p-2 border">Тип</th>
                            <th className="p-2 border">Статус</th>
                            <th className="p-2 border">Моя роль</th>
                            <th className="p-2 border">Мої години</th>
                            <th className="p-2 border">Всього години</th>
                            <th className="p-2 border">Створено</th>
                            <th className="p-2 border">Закрито</th>
                            <th className="p-2 border">Дефект</th>
                            <th className="p-2 border">Дії</th>
                        </tr>
                        </thead>

                        <tbody>
                        {assignedClaims.map(c => (
                            <tr
                                key={c.claimId}
                                onClick={() => navigate(`/employee/claims/${c.claimId}`)}
                                className="cursor-pointer hover:bg-blue-50"
                            >
                                <td className="p-2 border">№{c.claimId}</td>
                                <td className="p-2 border">
                                    {REPAIR_TYPE_LABELS[c.repairType]}
                                </td>
                                <td className="p-2 border">
                        <span className={`px-2 py-0.5 rounded text-xs ${STATUS_COLORS[c.status]}`}>
                            {CLAIM_STATUS_LABELS[c.status]}
                        </span>
                                </td>
                                <td className="p-2 border">
                                <span
                                    className={`
                                        inline-flex items-center
                                        px-2 py-0.5
                                        rounded-full
                                        text-xs font-medium
                                        ${ROLE_IN_CLAIM_COLORS[c.role]}
                                    `}
                                >
                                    {ROLE_IN_CLAIM_LABELS[c.role]}
                                </span>
                                </td>
                                <td className="p-2 border text-center">
                                    {c.hoursWorked}
                                </td>
                                <td className="p-2 border text-center">
                                    {c.totalTimeSpent}
                                </td>
                                <td className="p-2 border">
                                    {formatDateTime(c.createdAt)}
                                </td>
                                <td className="p-2 border">
                                    {c.closedAt ? formatDateTime(c.closedAt) : '—'}
                                </td>
                                <td className="p-2 border max-w-xs truncate">
                                    {c.defectDescription}
                                </td>
                                <td className="p-2 border">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/employee/claims/${c.claimId}`);
                                        }}
                                        className="text-blue-600 hover:underline"
                                    >
                                        Деталі →
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )
            ) : (
                /* таблиця для CLIENT / MANAGER */
                <div className="overflow-x-auto rounded border">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100 text-left">
                        <tr>
                            <th className="p-2 border">№</th>
                            <th className="p-2 border">Тип ремонту</th>
                            <th className="p-2 border">Статус</th>
                            <th className="p-2 border">Опис дефекту</th>
                            <th className="p-2 border">Створено</th>
                            <th className="p-2 border">Закрито</th>
                            <th className="p-2 border w-20 text-center">Дії</th>
                        </tr>
                        </thead>

                        <tbody>
                        {claims.map(c => (
                            <tr
                                key={c.id}
                                onClick={() => openClaim(c.id)}
                                className="cursor-pointer hover:bg-blue-50 transition"
                            >
                                <td className="p-2 border font-medium">
                                    №{c.id}
                                </td>

                                <td className="p-2 border">
                                    {REPAIR_TYPE_LABELS[c.repairType]}
                                </td>

                                <td className="p-2 border">
                                <span
                                    className={`px-2 py-0.5 rounded text-xs font-medium ${STATUS_COLORS[c.status]}`}
                                >
                                    {CLAIM_STATUS_LABELS[c.status]}
                                </span>
                                </td>

                                <td className="p-2 border max-w-xs truncate">
                                    {c.defectDescription}
                                </td>

                                <td className="p-2 border whitespace-nowrap">
                                    {formatDateTime(c.createdAt)}
                                </td>

                                <td className="p-2 border whitespace-nowrap">
                                    {formatDateTime(c.closedAt)}
                                </td>

                                <td className="p-2 border">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation(); // важливо
                                            openClaim(c.id);
                                        }}
                                        className="text-blue-600 hover:underline text-sm"
                                    >
                                        Деталі →
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
