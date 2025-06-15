import type { CanvasInputHandler } from "../../adapters/input/canvas-input-handler";
import type { AddShape } from "../../core/use-cases/add-shape";
import type { IRenderingManager } from "../../core/interfaces/rendering-manager";
import { Tool } from "../../core/entities/Tool";
import { Circle } from "../../core/entities/Circle";

export class ToolCircle extends Tool {
    private startX = 0;
    private startY = 0;
    private currentCircle: Circle | null = null;

    constructor(
        canvasInput: CanvasInputHandler,
        addShape: AddShape,
        renderingManager: IRenderingManager
    ) {
        super(canvasInput, addShape, renderingManager);
    }

    activate(): void {
        document.body.style.cursor = 'crosshair';

        this.canvasInput.subscribe("mouseDown", this.handleMouseDown);
    }

    deactivate(): void {
        document.body.style.cursor = 'default';
        this.canvasInput.unsubscribe("mouseDown", this.handleMouseDown);
        this.canvasInput.unsubscribe("mouseMove", this.handleMouseMove);
        this.canvasInput.unsubscribe("mouseUp", this.handleMouseUp);

        if (this.renderingManager) {
            this.renderingManager.setTemporaryShape(null);
        }
        this.currentCircle = null;
    }

    private handleMouseDown = (x: number, y: number): void => {
        this.startX = x;
        this.startY = y;
        const idGenerator = () => `shape-${Math.random().toString(36).slice(2, 9)}`;

        this.currentCircle = new Circle(
            idGenerator(), x, y, 1, "#000000", 2, "#FFFFFF"
        );

        this.renderingManager.setTemporaryShape(this.currentCircle);

        this.canvasInput.subscribe("mouseMove", this.handleMouseMove);
        this.canvasInput.subscribe("mouseUp", this.handleMouseUp);
    };

    private handleMouseMove = (x: number, y: number): void => {
        if (!this.currentCircle) return;

        const distance = Math.sqrt(Math.pow(x - this.startX, 2) + Math.pow(y - this.startY, 2));
        this.currentCircle.radius = distance;

        this.renderingManager.setTemporaryShape(this.currentCircle);
    };

    private handleMouseUp = (): void => {
        if (!this.currentCircle) return;

        if (Math.abs(this.currentCircle.radius) < 1) {
            this.currentCircle.radius = 2;
        }

        this.addShape.execute(this.currentCircle);

        this.renderingManager.setTemporaryShape(null);
        this.currentCircle = null;
    };
}