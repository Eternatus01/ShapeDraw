import type { CanvasInputHandler } from "../../adapters/input/canvas-input-handler";
import type { IRenderingManager } from "../../core/interfaces/rendering-manager";
import type { ShapesRepository } from "../../core/interfaces/shapes-repository";
import type { AddShape } from "../../core/use-cases/add-shape";
import type { ChangeShapeProperty } from "../../core/use-cases/change-shape-property";
import type { MoveShape } from "../../core/use-cases/move-shape";
import type { RemoveShape } from "../../core/use-cases/remove-shape";
import { Tool } from "../../core/entities/Tool";
import { ShapeSelectionManager } from "./shape-selection-manager";
import { ShapeDragHandler } from "./shape-drag-handler";
import { ShapePropertiesPanel } from "./shape-properties-panel";

export class ToolSelect extends Tool {
    private shapesRepo: ShapesRepository;
    private selectionManager: ShapeSelectionManager;
    private dragHandler: ShapeDragHandler;
    private propertiesPanel: ShapePropertiesPanel;
    private removeShape: RemoveShape;
    private keydownHandler: (event: KeyboardEvent) => void;

    constructor(
        canvasInput: CanvasInputHandler,
        addShape: AddShape,
        shapesRepo: ShapesRepository,
        renderingManager: IRenderingManager,
        moveShape: MoveShape,
        changeShapeProperty: ChangeShapeProperty,
        removeShape: RemoveShape
    ) {
        super(canvasInput, addShape, renderingManager);
        this.shapesRepo = shapesRepo;
        this.removeShape = removeShape;

        this.selectionManager = new ShapeSelectionManager(renderingManager);
        this.dragHandler = new ShapeDragHandler(moveShape);
        this.propertiesPanel = new ShapePropertiesPanel(changeShapeProperty);

        this.propertiesPanel.setSelectionManager(this.selectionManager);

        this.keydownHandler = this.handleKeyDown.bind(this);
    }

    activate(): void {
        this.canvasInput.subscribe("mouseDown", this.handleMouseDown);
        document.addEventListener('keydown', this.keydownHandler);
    }

    deactivate(): void {
        this.canvasInput.unsubscribe("mouseDown", this.handleMouseDown);
        this.selectionManager.clearSelection();
        document.removeEventListener('keydown', this.keydownHandler);
    }

    private handleKeyDown(event: KeyboardEvent): void {
        if (event.key === 'Delete' || event.keyCode === 46) {
            const selectedShape = this.selectionManager.getSelectedShape();
            if (selectedShape) {
                this.removeShape.execute(selectedShape);
                this.selectionManager.clearSelection();
                this.propertiesPanel.updateControls(null);
            }
        }
    }

    private handleMouseDown = (x: number, y: number): void => {
        const selectedShape = this.selectionManager.getSelectedShape();

        if (selectedShape && selectedShape.isPointInside(x, y)) {
            this.dragHandler.startDrag(selectedShape, x, y);

            this.canvasInput.subscribe("mouseMove", this.handleMouseMove);
            this.canvasInput.subscribe("mouseUp", this.handleMouseUp);

            document.getElementById('canvas')!.style.cursor = 'move';
            return;
        }

        this.selectionManager.clearSelection();

        const shapes = this.shapesRepo.getAll();
        for (let i = shapes.length - 1; i >= 0; i--) {
            const shape = shapes[i];
            if (shape.isPointInside(x, y)) {
                this.selectionManager.selectShape(shape);
                this.propertiesPanel.updateControls(shape);
                break;
            }
        }
    };

    private handleMouseMove = (x: number, y: number): void => {
        const selectedShape = this.selectionManager.getSelectedShape();
        if (!selectedShape) return;

        this.dragHandler.drag(selectedShape, x, y);
        this.renderingManager.setSelectedShape(selectedShape);
    };

    private handleMouseUp = (): void => {
        const selectedShape = this.selectionManager.getSelectedShape();
        if (selectedShape) {
            this.dragHandler.endDrag(selectedShape);
        }

        document.getElementById('canvas')!.style.cursor = 'default';

        this.canvasInput.unsubscribe("mouseMove", this.handleMouseMove);
        this.canvasInput.unsubscribe("mouseUp", this.handleMouseUp);
    };
}