import type { ShapesRepository } from "../core/interfaces/shapes-repository";
import type { IRenderingManager } from "../core/interfaces/rendering-manager";

export class CanvasView {
    private shapesRepo: ShapesRepository;
    private renderingManager: IRenderingManager;

    constructor(
        shapesRepo: ShapesRepository,
        renderingManager: IRenderingManager
    ) {
        this.shapesRepo = shapesRepo;
        this.renderingManager = renderingManager;

        shapesRepo.subscribe(() => this.updateShapes());

        this.renderingManager.startRendering();
    }

    private updateShapes(): void {
        const shapes = this.shapesRepo.getAll();
        this.renderingManager.setShapes(shapes);
    }
}