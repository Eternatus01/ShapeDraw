export interface IRenderer {
    drawLine(x1: number, y1: number, x2: number, y2: number, color: string, lineWidth: number, lineColor: string): void;
    drawRect(x: number, y: number, width: number, height: number, color: string, lineWidth: number, lineColor: string): void;
    drawCircle(x: number, y: number, radius: number, color: string, lineWidth: number, lineColor: string): void;
    clear(): void;
}