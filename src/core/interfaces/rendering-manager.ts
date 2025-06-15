import type { Shape } from "../entities/Shape";

export interface IRenderingManager {
    readonly selectedShape: Shape | null;
    setShapes(shapes: Shape[]): void;
    setTemporaryShape(shape: Shape | null): void;
    startRendering(): void;
    stopRendering(): void;
    setSelectedShape(shape: Shape | null): void;
}