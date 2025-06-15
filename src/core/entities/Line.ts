import { Shape } from "./Shape";

export class Line extends Shape {
    public x2: number
    public y2: number
    public type: string = 'Line';

    constructor(id: string, x: number, y: number, x2: number, y2: number, color: string, lineWidth: number) {
        super(id, x, y, color, lineWidth);
        this.x2 = x2
        this.y2 = y2
    }

    isPointInside(x: number, y: number): boolean {
        const lineLength = Math.sqrt(Math.pow(this.x2 - this.x, 2) + Math.pow(this.y2 - this.y, 2));

        if (lineLength === 0) {
            return Math.sqrt(Math.pow(x - this.x, 2) + Math.pow(y - this.y, 2)) <= this.lineWidth;
        }

        const distance = Math.abs(
            (this.y2 - this.y) * x - (this.x2 - this.x) * y + this.x2 * this.y - this.y2 * this.x
        ) / lineLength;

        const dot1 = (x - this.x) * (this.x2 - this.x) + (y - this.y) * (this.y2 - this.y);
        const dot2 = (x - this.x2) * (this.x - this.x2) + (y - this.y2) * (this.y - this.y2);

        return distance <= this.lineWidth && dot1 >= 0 && dot2 >= 0;
    }

    move(dx: number, dy: number): void {
        super.move(dx, dy);
        this.x2 += dx;
        this.y2 += dy;
    }
}