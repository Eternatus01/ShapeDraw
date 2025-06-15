import type { Shape } from "../entities/Shape";

export interface ShapePropertyChanger {
    changeFillColor(shape: Shape, color: string): void;
    changeStrokeColor(shape: Shape, color: string): void;
    changeLineWidth(shape: Shape, width: number): void;
    changeDimensions(shape: Shape, width: number, height: number): void;
}