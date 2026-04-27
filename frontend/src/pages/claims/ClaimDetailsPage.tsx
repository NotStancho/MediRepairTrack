import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { Claim } from '../../types/claim/claim';
import ClaimHeader from '../../components/claims/ClaimHeader';
import ClaimTabs from '../../components/claims/ClaimTabs';
import ClaimStatusUpdate from '../../components/claims/ClaimStatusUpdate';
import { getClaimById } from '../../api/claim';

import { getEquipmentFullById } from '../../api/equipment';
import type { EquipmentFull } from '../../types/equipment/equipmentFull';

export default function ClaimDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const claimId = Number(id);

    const [claim, setClaim] = useState<Claim | null>(null);
    const [loading, setLoading] = useState(true);

    const [equipment, setEquipment] = useState<EquipmentFull | null>(null);

    const refreshClaim = useCallback(async () => {
        if (!claimId) {
            return;
        }

        const nextClaim = await getClaimById(claimId);
        setClaim(nextClaim);
    }, [claimId]);

    useEffect(() => {
        if (!claimId) return;

        let cancelled = false;

        const load = async () => {
            setLoading(true);

            try {
                const nextClaim = await getClaimById(claimId);

                if (cancelled) {
                    return;
                }

                setClaim(nextClaim);

                const nextEquipment = await getEquipmentFullById(nextClaim.equipmentId);

                if (!cancelled) {
                    setEquipment(nextEquipment);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        void load();

        return () => {
            cancelled = true;
        };
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
                    <ClaimStatusUpdate claim={claim} onUpdated={refreshClaim} />
                }
            />

            <ClaimTabs claim={claim} onClaimUpdated={refreshClaim} />
        </div>
    );
}
