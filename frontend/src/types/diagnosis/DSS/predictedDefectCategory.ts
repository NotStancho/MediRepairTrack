// types/diagnosis/DSS/predictedDefectCategory.ts

export interface PredictedDefectCategory {
    predictionId: number;
    defectCategoryId: number;

    probabilityScore: number;
    rankPosition: number;

    createdAt: string;
}