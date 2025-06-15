import type { Command } from "../../interfaces/command";
import type { Shape } from "../Shape";
import type { ShapesRepository } from "../../interfaces/shapes-repository";

export class MoveShapeCommand implements Command {
    private shape: Shape;
    private repository: ShapesRepository;
    private dx: number;
    private dy: number;

    constructor(shape: Shape, repository: ShapesRepository, dx: number, dy: number) {
        this.shape = shape;
        this.repository = repository;
        this.dx = dx;
        this.dy = dy;
    }

    execute(): void {
        this.shape.move(this.dx, this.dy);
        this.repository.notify();
    }

    undo(): void {
        this.shape.move(-this.dx, -this.dy);
        this.repository.notify();
    }
} 