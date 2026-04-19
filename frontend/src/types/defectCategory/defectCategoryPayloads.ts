// types/defectCategory/defectCategoryPayloads.ts

export interface CreateDefectCategoryPayload {
    name: string;
    description: string;
    typicalSymptoms: string;
}

export interface UpdateDefectCategoryPayload {
    name: string;
    description: string;
    typicalSymptoms: string;
}
