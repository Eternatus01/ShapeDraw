import type { Command } from "../../interfaces/command";
import type { Shape } from "../Shape";
import type { ShapesRepository } from "../../interfaces/shapes-repository";
import type { WithLineColor } from "../../interfaces/shape-properties";
import { hasLineColor } from "../../interfaces/shape-properties";
import { Line } from "../Line";

export class ChangeStrokeColorCommand implements Command {
    private shape: Shape;
    private repository: ShapesRepository;
    private oldColor: string;
    private newColor: string;
    private isLine: boolean;

    constructor(shape: Shape, repository: ShapesRepository, newColor: string) {
        this.shape = shape;
        this.repository = repository;
        this.isLine = shape instanceof Line;

        if (this.isLine) {
            this.oldColor = (shape as Line).color;
        } else if (hasLineColor(shape as any)) {
            this.oldColor = (shape as unknown as WithLineColor).lineColor;
        } else {
            this.oldColor = '';
        }

        this.newColor = newColor;
    }

    execute(): void {
        if (this.isLine) {
            (this.shape as Line).color = this.newColor;
        } else if (hasLineColor(this.shape as any)) {
            (this.shape as unknown as WithLineColor).lineColor = this.newColor;
        }
        this.repository.notify();
    }

    undo(): void {
        if (this.isLine) {
            (this.shape as Line).color = this.oldColor;
        } else if (hasLineColor(this.shape as any)) {
            (this.shape as unknown as WithLineColor).lineColor = this.oldColor;
        }
        this.repository.notify();
    }
} 