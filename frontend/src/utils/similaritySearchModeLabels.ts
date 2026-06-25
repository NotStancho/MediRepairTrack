// utils/similaritySearchModeLabels.ts

import type { SimilaritySearchMode } from '../types/diagnosis/DSS/similaritySearchMode';

export const SIMILARITY_SEARCH_MODE_LABELS: Record<SimilaritySearchMode, string> = {
    AUTO_HIERARCHICAL: 'Автовибір',
    SAME_MODEL: 'Та сама модель',
    SAME_MANUFACTURER_AND_EQUIPMENT_TYPE: 'Той самий виробник і тип обладнання',
    SAME_EQUIPMENT_TYPE: 'Той самий тип обладнання',
    SAME_MANUFACTURER: 'Той самий виробник',
    ALL: 'Усі заявки',
};

export const SIMILARITY_SEARCH_MODE_DESCRIPTIONS: Record<SimilaritySearchMode, string> = {
    AUTO_HIERARCHICAL:
        'Система сама вибере, наскільки широко шукати схожі заявки.',
    SAME_MODEL:
        'Шукати тільки серед заявок для цієї ж моделі обладнання.',
    SAME_MANUFACTURER_AND_EQUIPMENT_TYPE:
        'Шукати серед заявок того ж виробника і типу обладнання.',
    SAME_EQUIPMENT_TYPE:
        'Шукати серед заявок з таким самим типом обладнання.',
    SAME_MANUFACTURER:
        'Шукати серед заявок обладнання цього ж виробника.',
    ALL:
        'Шукати серед усіх доступних історичних заявок.',
};

export const SIMILARITY_SEARCH_MODE_COLORS: Record<SimilaritySearchMode, string> = {
    AUTO_HIERARCHICAL: 'bg-indigo-100 text-indigo-800',
    SAME_MODEL: 'bg-green-100 text-green-800',
    SAME_MANUFACTURER_AND_EQUIPMENT_TYPE: 'bg-teal-100 text-teal-800',
    SAME_EQUIPMENT_TYPE: 'bg-blue-100 text-blue-800',
    SAME_MANUFACTURER: 'bg-purple-100 text-purple-800',
    ALL: 'bg-slate-100 text-slate-700',
};

export const SIMILARITY_SEARCH_MODE_OPTIONS: SimilaritySearchMode[] = [
    'AUTO_HIERARCHICAL',
    'SAME_MODEL',
    'SAME_MANUFACTURER_AND_EQUIPMENT_TYPE',
    'SAME_EQUIPMENT_TYPE',
    'SAME_MANUFACTURER',
    'ALL',
];