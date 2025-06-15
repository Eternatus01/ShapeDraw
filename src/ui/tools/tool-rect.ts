import type { CanvasInputHandler } from "../../adapters/input/canvas-input-handler";
import type { AddShape } from "../../core/use-cases/add-shape";
import type { IRenderingManager } from "../../core/interfaces/rendering-manager";
import { Rect } from "../../core/entities/Rect";
import { Tool } from "../../core/entities/Tool";

export class ToolRect extends Tool {
    private startX = 0;
    private startY = 0;
    private currentRect: Rect | null = null;

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
        this.currentRect = null;
    }

    private handleMouseDown = (x: number, y: number): void => {
        this.startX = x;
        this.startY = y;
        const idGenerator = () => `shape-${Math.random().toString(36).slice(2, 9)}`;

        this.currentRect = new Rect(
            idGenerator(), x, y, 0, 0, "#000000", 2, "#FFFFFF"
        );

        this.renderingManager.setTemporaryShape(this.currentRect);

        this.canvasInput.subscribe("mouseMove", this.handleMouseMove);
        this.canvasInput.subscribe("mouseUp", this.handleMouseUp);
    };

    private handleMouseMove = (x: number, y: number): void => {
        if (!this.currentRect) return;

        this.currentRect.width = x - this.startX;
        this.currentRect.height = y - this.startY;

        this.renderingManager.setTemporaryShape(this.currentRect);
    };

    private handleMouseUp = (): void => {
        if (!this.currentRect) return;

        if (Math.abs(this.currentRect.width) < 5 || Math.abs(this.currentRect.height) < 5) {
            this.currentRect.width = 100;
            this.currentRect.height = 80;
        }

        this.addShape.execute(this.currentRect);

        this.renderingManager.setTemporaryShape(null);
        this.currentRect = null;
    };
}