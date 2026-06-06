// types/diagnosis/DSS/complexityLevel.ts

export interface ComplexityLevel {
    id: number;
    name: string;
    description: string;
}

export type ComplexityLevelShort = Pick<ComplexityLevel, 'id' | 'name'>;
