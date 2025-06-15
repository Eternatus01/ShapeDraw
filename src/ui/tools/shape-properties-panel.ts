import type { Shape } from "../../core/entities/Shape";
import type { ChangeShapeProperty } from "../../core/use-cases/change-shape-property";
import { hasLineColor, hasDimensions, hasRadius } from "../../core/interfaces/shape-properties";
import type { WithLineColor, WithDimensions, WithRadius, ShapeProperty } from "../../core/interfaces/shape-properties";
import { Line } from "../../core/entities/Line";
import type { ShapeSelectionManager } from "./shape-selection-manager";

export class ShapePropertiesPanel {
    private changeShapeProperty: ChangeShapeProperty;
    private selectionManager: ShapeSelectionManager | null = null;
    private decimalPlaces: number = 1;

    constructor(changeShapeProperty: ChangeShapeProperty) {
        this.changeShapeProperty = changeShapeProperty;
        this.setupControls();
    }

    setSelectionManager(selectionManager: ShapeSelectionManager): void {
        this.selectionManager = selectionManager;
    }

    setDecimalPlaces(places: number): void {
        this.decimalPlaces = places;
    }

    setupControls(): void {
        const fillColorPicker = document.getElementById('fill-color') as HTMLInputElement;
        const strokeColorPicker = document.getElementById('stroke-color') as HTMLInputElement;
        const strokeWidthSlider = document.getElementById('stroke-width') as HTMLInputElement;
        const widthInput = document.getElementById('width-input') as HTMLInputElement;
        const heightInput = document.getElementById('height-input') as HTMLInputElement;

        if (fillColorPicker) {
            fillColorPicker.addEventListener('input', () => {
                const shape = this.getSelectedShape();
                if (shape) this.handleFillColorChange(shape, fillColorPicker.value);
            });
        }

        if (strokeColorPicker) {
            strokeColorPicker.addEventListener('input', () => {
                const shape = this.getSelectedShape();
                if (shape) this.handleStrokeColorChange(shape, strokeColorPicker.value);
            });
        }

        if (strokeWidthSlider) {
            strokeWidthSlider.addEventListener('input', () => {
                const shape = this.getSelectedShape();
                if (shape) this.handleLineWidthChange(shape, parseInt(strokeWidthSlider.value));
            });
        }

        if (widthInput) {
            widthInput.addEventListener('change', () => {
                const shape = this.getSelectedShape();
                if (shape) this.handleWidthChange(shape, parseFloat(widthInput.value));
            });
        }

        if (heightInput) {
            heightInput.addEventListener('change', () => {
                const shape = this.getSelectedShape();
                if (shape) this.handleHeightChange(shape, parseFloat(heightInput.value));
            });
        }
    }

    updateControls(shape: Shape | null): void {
        if (!shape) {
            this.resetControls();
            return;
        }

        const fillColorPicker = document.getElementById('fill-color') as HTMLInputElement;
        const strokeColorPicker = document.getElementById('stroke-color') as HTMLInputElement;
        const strokeWidthSlider = document.getElementById('stroke-width') as HTMLInputElement;
        const widthInput = document.getElementById('width-input') as HTMLInputElement;
        const heightInput = document.getElementById('height-input') as HTMLInputElement;

        if (fillColorPicker) {
            fillColorPicker.value = shape.color;
        }

        if (strokeColorPicker && hasLineColor(shape as ShapeProperty)) {
            const shapeWithLine = shape as unknown as WithLineColor;
            strokeColorPicker.value = shapeWithLine.lineColor;
        } else if (strokeColorPicker && shape instanceof Line) {
            strokeColorPicker.value = shape.color;
        }

        if (strokeWidthSlider) {
            strokeWidthSlider.value = this.formatNumber(shape.lineWidth);
        }

        if (widthInput) {
            if (hasDimensions(shape as ShapeProperty)) {
                const shapeWithDimensions = shape as unknown as WithDimensions;
                widthInput.value = this.formatNumber(shapeWithDimensions.width);
            } else if (shape instanceof Line) {
                const width = Math.abs(shape.x2 - shape.x);
                widthInput.value = this.formatNumber(width);
            } else if (hasRadius(shape as ShapeProperty)) {
                const shapeWithRadius = shape as unknown as WithRadius;
                widthInput.value = this.formatNumber(shapeWithRadius.radius * 2);
            }
        }

        if (heightInput) {
            if (hasDimensions(shape as ShapeProperty)) {
                const shapeWithDimensions = shape as unknown as WithDimensions;
                heightInput.value = this.formatNumber(shapeWithDimensions.height);
            } else if (shape instanceof Line) {
                const height = Math.abs(shape.y2 - shape.y);
                heightInput.value = this.formatNumber(height);
            } else if (hasRadius(shape as ShapeProperty)) {
                const shapeWithRadius = shape as unknown as WithRadius;
                heightInput.value = this.formatNumber(shapeWithRadius.radius * 2);
            }
        }
    }

    private resetControls(): void {
        const fillColorPicker = document.getElementById('fill-color') as HTMLInputElement;
        const strokeColorPicker = document.getElementById('stroke-color') as HTMLInputElement;
        const strokeWidthSlider = document.getElementById('stroke-width') as HTMLInputElement;
        const widthInput = document.getElementById('width-input') as HTMLInputElement;
        const heightInput = document.getElementById('height-input') as HTMLInputElement;

        if (fillColorPicker) fillColorPicker.value = "#000000";
        if (strokeColorPicker) strokeColorPicker.value = "#000000";
        if (strokeWidthSlider) strokeWidthSlider.value = "2";
        if (widthInput) widthInput.value = "";
        if (heightInput) heightInput.value = "";
    }

    handleFillColorChange(shape: Shape, color: string): void {
        this.changeShapeProperty.changeFillColor(shape, color);
    }

    handleStrokeColorChange(shape: Shape, color: string): void {
        this.changeShapeProperty.changeStrokeColor(shape, color);
    }

    handleLineWidthChange(shape: Shape, width: number): void {
        this.changeShapeProperty.changeLineWidth(shape, width);
    }

    handleWidthChange(shape: Shape, width: number): void {
        if (shape instanceof Line) {
            const height = Math.abs(shape.y2 - shape.y);
            this.changeShapeProperty.changeDimensions(shape, width, height);
        } else {
            const height = hasDimensions(shape as ShapeProperty)
                ? (shape as unknown as WithDimensions).height
                : hasRadius(shape as ShapeProperty)
                    ? (shape as unknown as WithRadius).radius * 2
                    : 0;

            this.changeShapeProperty.changeDimensions(shape, width, height);
        }
    }

    handleHeightChange(shape: Shape, height: number): void {
        if (shape instanceof Line) {
            const width = Math.abs(shape.x2 - shape.x);
            this.changeShapeProperty.changeDimensions(shape, width, height);
        } else {
            const width = hasDimensions(shape as ShapeProperty)
                ? (shape as unknown as WithDimensions).width
                : hasRadius(shape as ShapeProperty)
                    ? (shape as unknown as WithRadius).radius * 2
                    : 0;

            this.changeShapeProperty.changeDimensions(shape, width, height);
        }
    }

    private getSelectedShape(): Shape | null {
        if (this.selectionManager) {
            return this.selectionManager.getSelectedShape();
        }
        return null;
    }

    private formatNumber(value: number): string {
        if (this.decimalPlaces <= 0) {
            return Math.round(value).toString();
        }
        return value.toFixed(this.decimalPlaces);
    }
}