// types/defectCategory/defectCategory.ts

export interface DefectCategory {
    id: number;
    name: string;
    description: string;
    typicalSymptoms: string;
    createdAt: string;
    updatedAt?: string | null;
}
