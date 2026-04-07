// types/common/valueObjects.ts

export type Probability = number & { __brand: 'Probability' };

export function toProbability(value: number): Probability {
    if (value < 0 || value > 1) {
        throw new Error('Ймовірність має бути в межах 0..1');
    }
    return value as Probability;
}