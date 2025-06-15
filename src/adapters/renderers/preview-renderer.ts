export class PreviewRenderer {
    private previewCtx: CanvasRenderingContext2D;
    private canvas: HTMLCanvasElement

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.previewCtx = this.canvas.getContext('2d')!;
    }

    clear() {
        this.previewCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawRect(
        x: number,
        y: number,
        width: number,
        height: number,
        fillColor: string = 'rgba(0, 100, 255, 0.2)',
        lineWidth: number = 1,
        strokeColor: string = 'rgba(0, 100, 255, 0.8)',
    ) {
        this.previewCtx.fillStyle = fillColor;
        this.previewCtx.strokeStyle = strokeColor;
        this.previewCtx.lineWidth = lineWidth;

        this.previewCtx.beginPath();
        this.previewCtx.rect(x, y, width, height);
        this.previewCtx.fill();
        this.previewCtx.stroke();
    }

    drawLine(x1: number, y1: number, x2: number, y2: number) {
        this.previewCtx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
        this.previewCtx.lineWidth = 2;
        this.previewCtx.beginPath();
        this.previewCtx.moveTo(x1, y1);
        this.previewCtx.lineTo(x2, y2);
        this.previewCtx.stroke();
    }
    
    drawCircle(
        x: number,
        y: number,
        radius: number,
        fillColor: string = 'rgba(0, 100, 255, 0.2)',
        lineWidth: number = 1,
        strokeColor: string = 'rgba(0, 100, 255, 0.8)',
    ) {
        this.previewCtx.fillStyle = fillColor;
        this.previewCtx.strokeStyle = strokeColor;
        this.previewCtx.lineWidth = lineWidth;

        this.previewCtx.beginPath();
        this.previewCtx.arc(x, y, radius, 0, Math.PI * 2);
        this.previewCtx.fill();
        this.previewCtx.stroke();
    }
}