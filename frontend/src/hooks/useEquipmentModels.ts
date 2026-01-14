// hooks/useEquipmentModels
import { useEffect, useState } from 'react';
import { getEquipmentModels } from '../api/equipmentModel';
import type { EquipmentModel } from '../types/equipment/equipmentModel';

export function useEquipmentModels() {
    const [models, setModels] = useState<EquipmentModel[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getEquipmentModels()
            .then(setModels)
            .finally(() => setLoading(false));
    }, []);

    return {
        models,
        loading
    };
}
