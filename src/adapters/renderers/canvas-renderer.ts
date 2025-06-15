import type { IRenderer } from "../../core/interfaces/renderer";

export class CanvasRenderer implements IRenderer {
    private ctx: CanvasRenderingContext2D
    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx
    }

    drawLine(x1: number, y1: number, x2: number, y2: number, color: string, lineWidth: number): void {
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = lineWidth;
        this.ctx.stroke();
    }

    drawRect(x: number, y: number, width: number, height: number, color: string, lineWidth: number, lineColor: string): void {
        this.ctx.beginPath();
        this.ctx.fillStyle = color;
        this.ctx.strokeStyle = lineColor;
        this.ctx.lineWidth = lineWidth;
        this.ctx.rect(x, y, width, height);
        this.ctx.fill();
        this.ctx.stroke();
    }

    drawCircle(x: number, y: number, radius: number, color: string, lineWidth: number, lineColor: string): void {
        this.ctx.beginPath();
        this.ctx.fillStyle = color;
        this.ctx.strokeStyle = lineColor;
        this.ctx.lineWidth = lineWidth;
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();
    }

    clear(): void {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }
}