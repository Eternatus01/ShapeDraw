import type { Shape } from "../../core/entities/Shape";
import type { IRenderingManager } from "../../core/interfaces/rendering-manager";

export class ShapeSelectionManager {
    private selectedShape: Shape | null = null;
    private renderingManager: IRenderingManager;

    constructor(renderingManager: IRenderingManager) {
        this.renderingManager = renderingManager;
    }

    selectShape(shape: Shape): void {
        this.selectedShape = shape;
        this.renderingManager.setSelectedShape(shape);
    }

    clearSelection(): void {
        this.selectedShape = null;
        this.renderingManager.setSelectedShape(null);
    }

    getSelectedShape(): Shape | null {
        return this.selectedShape;
    }
}