import { Circle } from "../../core/entities/Circle";
import { Line } from "../../core/entities/Line";
import { Rect } from "../../core/entities/Rect";
import type { Shape } from "../../core/entities/Shape";
import type { IRenderingManager } from "../../core/interfaces/rendering-manager";
import type { CanvasRenderer } from "./canvas-renderer";

export class RenderingManager implements IRenderingManager {
    private renderer: CanvasRenderer;
    private shapes: Shape[] = [];
    private temporaryShape: Shape | null = null;
    private isRendering: boolean = false;
    private _selectedShape: Shape | null = null;

    constructor(renderer: CanvasRenderer) {
        this.renderer = renderer;
    }

    get selectedShape(): Shape | null {
        return this._selectedShape;
    }

    setShapes(shapes: Shape[]) {
        this.shapes = shapes;
    }

    setTemporaryShape(shape: Shape | null) {
        this.temporaryShape = shape;
    }

    setSelectedShape(shape: Shape | null): void {
        this._selectedShape = shape;
    }

    startRendering(): void {
        if (this.isRendering) return;

        this.isRendering = true;
        this.renderLoop();
    }

    stopRendering(): void {
        this.isRendering = false;
    }

    private renderLoop(): void {
        const renderFrame = () => {
            this.render();

            if (this.isRendering) {
                requestAnimationFrame(renderFrame);
            }
        };

        requestAnimationFrame(renderFrame);
    }

    private render() {
        this.renderer.clear();

        this.shapes.forEach(shape => {
            if (shape instanceof Rect) {
                this.renderer.drawRect(
                    shape.x, shape.y, shape.width, shape.height,
                    shape.color, shape.lineWidth, shape.lineColor
                );
            } else if (shape instanceof Line) {
                this.renderer.drawLine(
                    shape.x, shape.y, shape.x2, shape.y2,
                    shape.color, shape.lineWidth
                );
            } else if (shape instanceof Circle) {
                this.renderer.drawCircle(
                    shape.x, shape.y, shape.radius,
                    shape.color, shape.lineWidth, shape.lineColor
                );
            }
        });

        if (this.temporaryShape) {
            if (this.temporaryShape instanceof Rect) {
                this.renderer.drawRect(
                    this.temporaryShape.x, this.temporaryShape.y,
                    this.temporaryShape.width, this.temporaryShape.height,
                    this.temporaryShape.color, this.temporaryShape.lineWidth,
                    this.temporaryShape.lineColor
                );
            } else if (this.temporaryShape instanceof Line) {
                this.renderer.drawLine(
                    this.temporaryShape.x, this.temporaryShape.y, this.temporaryShape.x2, this.temporaryShape.y2,
                    this.temporaryShape.color, this.temporaryShape.lineWidth
                );
            } else if (this.temporaryShape instanceof Circle) {
                this.renderer.drawCircle(
                    this.temporaryShape.x, this.temporaryShape.y, this.temporaryShape.radius,
                    this.temporaryShape.color, this.temporaryShape.lineWidth, this.temporaryShape.lineColor
                );
            }
        }

        if (this._selectedShape) {
            this.drawSelectionForShape(this._selectedShape);
        }
    }

    private drawSelectionForShape(shape: Shape): void {
        if (shape instanceof Rect) {
            this.renderer.drawRect(
                shape.x - 2,
                shape.y - 2,
                shape.width + 4,
                shape.height + 4,
                'transparent',
                2,
                '#00A0FF'
            );

        } else if (shape instanceof Line) {
            this.renderer.drawLine(shape.x, shape.y, shape.x2, shape.y2, '#00A0FF', 2);
        } else if (shape instanceof Circle) {
            this.renderer.drawCircle(
                shape.x, shape.y, shape.radius + 2,
                'transparent', 2, '#00A0FF'
            );
        }
    }
}