import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { Claim } from '../../types/claim/claim';
import ClaimHeader from '../../components/claims/ClaimHeader';
import ClaimTabs from '../../components/claims/ClaimTabs';
import ClaimStatusUpdate from '../../components/claims/ClaimStatusUpdate';
import { getClaimById } from '../../api/claim';

import { getEquipmentFullById } from "../../api/equipment";
import type { EquipmentFull } from "../../types/equipment/equipmentFull";

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
        <div className="space-y-4">
            <ClaimHeader
                claim={claim}
                equipment={equipment}
                actions={
                    <ClaimStatusUpdate claim={claim} onUpdated={setClaim} />
                }
            />

            <ClaimTabs claim={claim} />
        </div>
    );
}
