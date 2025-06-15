import type { WithDimensions, WithLineColor } from "../interfaces/shape-properties";
import { Shape } from "./Shape";

export class Rect extends Shape implements WithDimensions, WithLineColor {
    public width: number;
    public height: number;
    public lineColor: string;
    public type: string = 'Rect';

    constructor(id: string, x: number, y: number, width: number, height: number, color: string, lineWidth: number, lineColor: string) {
        super(id, x, y, color, lineWidth);
        this.width = width;
        this.height = height;
        this.lineColor = lineColor
    }

    isPointInside(x: number, y: number): boolean {
        return (
            x >= this.x &&
            x <= this.x + this.width &&
            y >= this.y &&
            y <= this.y + this.height
        );
    }
}