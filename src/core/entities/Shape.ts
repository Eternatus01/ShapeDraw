export abstract class Shape {
    public id: string;
    public x: number;
    public y: number;
    public color: string;
    public lineWidth: number;
    public abstract type: string;

    abstract isPointInside(x: number, y: number): boolean;

    constructor(id: string, x: number, y: number, color: string, lineWidth: number) {
        this.id = id
        this.x = x;
        this.y = y;
        this.color = color;
        this.lineWidth = lineWidth;
    }

    move(dx: number, dy: number): void {
        this.x += dx;
        this.y += dy;
    }
}