import type { CanvasInputHandler } from "../../adapters/input/canvas-input-handler";
import type { IRenderingManager } from "../interfaces/rendering-manager";
import type { AddShape } from "../use-cases/add-shape";

export abstract class Tool {
    protected canvasInput: CanvasInputHandler
    protected addShape: AddShape
    protected renderingManager: IRenderingManager
    constructor(
        canvasInput: CanvasInputHandler,
        addShape: AddShape,
        renderingManager: IRenderingManager
    ) {
        this.canvasInput = canvasInput;
        this.addShape = addShape;
        this.renderingManager = renderingManager
    }

    abstract activate(): void;
    abstract deactivate(): void;
}