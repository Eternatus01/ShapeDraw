import type { Command } from "../../interfaces/command";
import type { Shape } from "../Shape";
import type { ShapesRepository } from "../../interfaces/shapes-repository";

export class ChangeFillColorCommand implements Command {
    private shape: Shape;
    private repository: ShapesRepository;
    private oldColor: string;
    private newColor: string;

    constructor(shape: Shape, repository: ShapesRepository, newColor: string) {
        this.shape = shape;
        this.repository = repository;
        this.oldColor = shape.color;
        this.newColor = newColor;
    }

    execute(): void {
        this.shape.color = this.newColor;
        this.repository.notify();
    }

    undo(): void {
        this.shape.color = this.oldColor;
        this.repository.notify();
    }
} 