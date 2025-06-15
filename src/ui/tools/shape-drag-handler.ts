import type { Shape } from "../../core/entities/Shape";
import type { MoveShape } from "../../core/use-cases/move-shape";

export class ShapeDragHandler {
    private isDragging: boolean = false;
    private dragOffsetX: number = 0;
    private dragOffsetY: number = 0;
    private startX: number = 0;
    private startY: number = 0;
    private moveShape: MoveShape;

    constructor(moveShape: MoveShape) {
        this.moveShape = moveShape;
    }

    startDrag(shape: Shape, x: number, y: number): void {
        this.isDragging = true;
        this.dragOffsetX = x - shape.x;
        this.dragOffsetY = y - shape.y;
        this.startX = shape.x;
        this.startY = shape.y;
    }

    drag(shape: Shape, x: number, y: number): void {
        if (!this.isDragging) return;

        const newX = x - this.dragOffsetX;
        const newY = y - this.dragOffsetY;

        const dx = newX - shape.x;
        const dy = newY - shape.y;

        shape.move(dx, dy);
    }

    endDrag(shape: Shape): void {
        if (!this.isDragging) return;

        const dx = shape.x - this.startX;
        const dy = shape.y - this.startY;

        if (dx !== 0 || dy !== 0) {
            shape.move(-dx, -dy);

            this.moveShape.execute(shape, dx, dy);
        }

        this.isDragging = false;
    }

    isDraggingActive(): boolean {
        return this.isDragging;
    }
}