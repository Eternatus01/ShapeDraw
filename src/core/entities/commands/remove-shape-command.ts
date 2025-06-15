import type { Command } from "../../interfaces/command";
import type { Shape } from "../Shape";
import type { ShapesRepository } from "../../interfaces/shapes-repository";

export class RemoveShapeCommand implements Command {
    private shape: Shape;
    private repository: ShapesRepository;

    constructor(shape: Shape, repository: ShapesRepository) {
        this.shape = shape;
        this.repository = repository;
    }

    execute(): void {
        this.repository.remove(this.shape.id);
    }

    undo(): void {
        this.repository.add(this.shape);
    }
} 