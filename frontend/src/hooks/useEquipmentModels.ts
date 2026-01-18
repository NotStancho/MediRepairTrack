// hooks/useEquipmentModels
import { useEffect, useState } from 'react';
import type { EquipmentModel } from '../types/equipment/equipmentModel';
import { getEquipmentModels } from '../api/equipmentModel';

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
