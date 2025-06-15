import type { Shape } from "../entities/Shape";
import type { ShapesRepository } from "../interfaces/shapes-repository";

export class UpdateShape {
    private shapesRepo: ShapesRepository
    constructor(
        shapesRepo: ShapesRepository
    ) {
        this.shapesRepo = shapesRepo
    }

    execute(shapeId: string, changes: Partial<Shape>) {
        const shape = this.shapesRepo.get(shapeId);
        if (!shape) return;

        Object.assign(shape, changes);
    }
}