// hooks/useEquipmentResolver
import { useEffect, useState } from 'react';
import { findEquipmentByModelAndSerial } from '../api/equipment';

export type EquipmentResolveState =
    | 'IDLE'
    | 'CHECKING'
    | 'EXISTS'
    | 'NEW';

export function useEquipmentResolver(modelId: number | null, serialNumber: string) {
    const [state, setState] = useState<EquipmentResolveState>('IDLE');
    const [equipmentId, setEquipmentId] = useState<number | null>(null);

    useEffect(() => {
        if (modelId == null || !serialNumber.trim()) {
            setState('IDLE');
            setEquipmentId(null);
            return;
        }

        setState('CHECKING');
        setEquipmentId(null);

        const timeout = setTimeout(async () => {
            try {
                const eq = await findEquipmentByModelAndSerial(
                    modelId as number,
                    serialNumber.trim()
                );

                setEquipmentId(eq.id);
                setState('EXISTS');
            } catch (e: any) {
                if (e.status === 404) {
                    setEquipmentId(null);
                    setState('NEW');
                } else {
                    console.error(e);
                }
            }
        }, 1000);

        return () => clearTimeout(timeout);
    }, [modelId, serialNumber]);

    return {
        state,
        checking: state === 'CHECKING',
        exists: state === 'EXISTS',
        isNew: state === 'NEW',
        equipmentId
    };
}
