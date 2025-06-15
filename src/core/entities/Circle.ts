import type { WithLineColor, WithRadius } from "../interfaces/shape-properties";
import { Shape } from "./Shape";

export class Circle extends Shape implements WithRadius, WithLineColor {
    public radius: number;
    public lineColor: string;
    public type: string = 'Circle';

    constructor(id: string, x: number, y: number, radius: number, color: string, lineWidth: number, lineColor: string) {
        super(id, x, y, color, lineWidth);
        this.radius = radius;
        this.lineColor = lineColor;
    }

    isPointInside(x: number, y: number): boolean {
        const dx = x - this.x;
        const dy = y - this.y;
        return Math.sqrt(dx * dx + dy * dy) <= this.radius;
    }
}