import type { Command } from "../../interfaces/command";
import type { Shape } from "../Shape";
import type { ShapesRepository } from "../../interfaces/shapes-repository";

export class ChangeLineWidthCommand implements Command {
    private shape: Shape;
    private repository: ShapesRepository;
    private oldWidth: number;
    private newWidth: number;

    constructor(shape: Shape, repository: ShapesRepository, newWidth: number) {
        this.shape = shape;
        this.repository = repository;
        this.oldWidth = shape.lineWidth;
        this.newWidth = newWidth;
    }

    execute(): void {
        this.shape.lineWidth = this.newWidth;
        this.repository.notify();
    }

    undo(): void {
        this.shape.lineWidth = this.oldWidth;
        this.repository.notify();
    }
} 