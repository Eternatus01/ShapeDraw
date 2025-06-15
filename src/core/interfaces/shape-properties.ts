export interface WithLineColor {
    lineColor: string;
}

export interface WithDimensions {
    width: number;
    height: number;
}

export interface WithRadius {
    radius: number;
}

export type ShapeProperty = object;

export function hasLineColor(obj: ShapeProperty): obj is WithLineColor {
    return obj && typeof obj === 'object' && 'lineColor' in obj;
}

export function hasDimensions(obj: ShapeProperty): obj is WithDimensions {
    return obj && typeof obj === 'object' && 'width' in obj && 'height' in obj;
}

export function hasRadius(obj: ShapeProperty): obj is WithRadius {
    return obj && typeof obj === 'object' && 'radius' in obj;
} 