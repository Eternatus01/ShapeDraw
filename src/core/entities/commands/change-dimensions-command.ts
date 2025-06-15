import type { Command } from "../../interfaces/command";
import type { Shape } from "../Shape";
import type { ShapesRepository } from "../../interfaces/shapes-repository";
import type { WithDimensions, WithRadius } from "../../interfaces/shape-properties";
import { hasDimensions, hasRadius } from "../../interfaces/shape-properties";
import { Line } from "../Line";

export class ChangeDimensionsCommand implements Command {
    private shape: Shape;
    private repository: ShapesRepository;
    private oldWidth: number;
    private oldHeight: number;
    private newWidth: number;
    private newHeight: number;
    private isLine: boolean;
    private isRect: boolean;
    private isCircle: boolean;

    constructor(shape: Shape, repository: ShapesRepository, newWidth: number, newHeight: number) {
        this.shape = shape;
        this.repository = repository;
        this.newWidth = newWidth;
        this.newHeight = newHeight;

        this.isLine = shape instanceof Line;
        this.isRect = hasDimensions(shape as any);
        this.isCircle = hasRadius(shape as any);

        // Сохраняем старые значения
        if (this.isLine) {
            const line = shape as Line;
            this.oldWidth = Math.abs(line.x2 - line.x);
            this.oldHeight = Math.abs(line.y2 - line.y);
        } else if (this.isRect) {
            const rect = shape as unknown as WithDimensions;
            this.oldWidth = rect.width;
            this.oldHeight = rect.height;
        } else if (this.isCircle) {
            const circle = shape as unknown as WithRadius;
            this.oldWidth = circle.radius * 2;
            this.oldHeight = circle.radius * 2;
        } else {
            this.oldWidth = 0;
            this.oldHeight = 0;
        }
    }

    execute(): void {
        this.applyDimensions(this.newWidth, this.newHeight);
        this.repository.notify();
    }

    undo(): void {
        this.applyDimensions(this.oldWidth, this.oldHeight);
        this.repository.notify();
    }

    private applyDimensions(width: number, height: number): void {
        if (this.isLine) {
            const line = this.shape as Line;
            const widthDirection = (line.x2 - line.x) >= 0 ? 1 : -1;
            const heightDirection = (line.y2 - line.y) >= 0 ? 1 : -1;
            line.x2 = line.x + (width * widthDirection);
            line.y2 = line.y + (height * heightDirection);
        } else if (this.isRect) {
            const rect = this.shape as unknown as WithDimensions;
            rect.width = width;
            rect.height = height;
        } else if (this.isCircle) {
            const circle = this.shape as unknown as WithRadius;
            // Для круга берем среднее между шириной и высотой
            circle.radius = Math.max(width, height) / 2;
        }
    }
} 