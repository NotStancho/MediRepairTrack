import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { Claim } from '../../types/claim';
import ClaimHeader from '../../components/claims/ClaimHeader';
import ClaimTabs from '../../components/claims/ClaimTabs';
import { getClaimById } from '../../api/claim';

import {getEquipmentFullById} from "../../api/equipment";
import type {EquipmentFull} from "../../types/equipment";

export default function ClaimDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const claimId = Number(id);

    const [claim, setClaim] = useState<Claim | null>(null);
    const [loading, setLoading] = useState(true);

    const [equipment, setEquipment] = useState<EquipmentFull | null>(null);

    useEffect(() => {
        if (!claimId) return;

        setLoading(true);

        getClaimById(claimId)
            .then((c) => {
                setClaim(c);
                return getEquipmentFullById(c.equipmentId);
            })
            .then(setEquipment)
            .finally(() => setLoading(false));
    }, [claimId]);



    if (loading) {
        return <div>Завантаження заявки…</div>;
    }

    if (!claim) {
        return <div>Заявку не знайдено</div>;
    }

    return (
        <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
            <ClaimHeader
                claim={claim}
                equipment={equipment}
            />

            <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
                <ClaimTabs claim={claim} />
            </div>
        </div>
    );
}
