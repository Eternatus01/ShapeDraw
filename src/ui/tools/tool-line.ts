import type { CanvasInputHandler } from "../../adapters/input/canvas-input-handler";
import type { IRenderingManager } from "../../core/interfaces/rendering-manager";
import type { AddShape } from "../../core/use-cases/add-shape";
import { Line } from "../../core/entities/Line";
import { Tool } from "../../core/entities/Tool";

export class ToolLine extends Tool {
    private currentLine: Line | null = null;
    private twoPoint: Boolean = false

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
        this.canvasInput.unsubscribe("mouseDown", this.handleMouseDownTwoPoint);

        if (this.renderingManager) {
            this.renderingManager.setTemporaryShape(null);
        }
        this.currentLine = null;
    }

    private handleMouseDown = (x: number, y: number): void => {
        if (this.twoPoint) return
        this.twoPoint = true
        const idGenerator = () => `shape-${Math.random().toString(36).slice(2, 9)}`;

        this.currentLine = new Line(
            idGenerator(), x, y, 0, 0, "#000000", 2
        );

        this.canvasInput.subscribe("mouseMove", this.handleMouseMove);
        this.canvasInput.subscribe("mouseDown", this.handleMouseDownTwoPoint);
    };

    private handleMouseMove = (x: number, y: number) => {
        if (!this.currentLine) return;

        this.currentLine.x2 = x
        this.currentLine.y2 = y
        this.renderingManager.setTemporaryShape(this.currentLine);

    }

    private handleMouseDownTwoPoint = (): void => {
        if (!this.currentLine) return;

        this.addShape.execute(this.currentLine);
        this.renderingManager.setTemporaryShape(null);

        this.canvasInput.unsubscribe("mouseMove", this.handleMouseMove);
        this.canvasInput.unsubscribe("mouseDown", this.handleMouseDownTwoPoint);

        this.currentLine = null;
        this.twoPoint = false
    }
} 