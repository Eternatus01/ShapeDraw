import type { InputHandler } from "../../core/interfaces/input-handler";

type MouseDownCallback = (x: number, y: number) => void;
type MouseMoveCallback = (x: number, y: number) => void;
type MouseUpCallback = () => void;

type MouseEventType = "mouseDown" | "mouseMove" | "mouseUp";

export class CanvasInputHandler implements InputHandler {
    private subscribers: {
        mouseDown: MouseDownCallback[],
        mouseMove: MouseMoveCallback[],
        mouseUp: MouseUpCallback[]
    } = {
            mouseDown: [],
            mouseMove: [],
            mouseUp: []
        };
    private canvas: HTMLCanvasElement

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas
        canvas.addEventListener("mousedown", this.handleMouseDown);
        document.addEventListener("mousemove", this.handleMouseMove);
        document.addEventListener("mouseup", this.handleMouseUp);
    }

    subscribe(event: "mouseDown", callback: MouseDownCallback): void;
    subscribe(event: "mouseMove", callback: MouseMoveCallback): void;
    subscribe(event: "mouseUp", callback: MouseUpCallback): void;
    subscribe(event: MouseEventType, callback: MouseDownCallback | MouseMoveCallback | MouseUpCallback): void {
        if (event === "mouseDown") {
            this.subscribers.mouseDown.push(callback as MouseDownCallback);
        } else if (event === "mouseMove") {
            this.subscribers.mouseMove.push(callback as MouseMoveCallback);
        } else if (event === "mouseUp") {
            this.subscribers.mouseUp.push(callback as MouseUpCallback);
        }
    }

    unsubscribe(event: "mouseDown", callback: MouseDownCallback): void;
    unsubscribe(event: "mouseMove", callback: MouseMoveCallback): void;
    unsubscribe(event: "mouseUp", callback: MouseUpCallback): void;
    unsubscribe(event: MouseEventType, callback: MouseDownCallback | MouseMoveCallback | MouseUpCallback): void {
        if (event === "mouseDown") {
            this.subscribers.mouseDown = this.subscribers.mouseDown.filter(cb => cb !== callback);
        } else if (event === "mouseMove") {
            this.subscribers.mouseMove = this.subscribers.mouseMove.filter(cb => cb !== callback);
        } else if (event === "mouseUp") {
            this.subscribers.mouseUp = this.subscribers.mouseUp.filter(cb => cb !== callback);
        }
    }

    private handleMouseDown = (e: MouseEvent) => {
        const { x, y } = this.getCanvasCoords(e);
        this.subscribers.mouseDown.forEach(cb => cb(x, y));
    };

    private handleMouseMove = (e: MouseEvent) => {
        const { x, y } = this.getCanvasCoords(e);
        this.subscribers.mouseMove.forEach(cb => cb(x, y));
    };

    private handleMouseUp = () => {
        this.subscribers.mouseUp.forEach(cb => cb());
    };

    private getCanvasCoords(e: MouseEvent) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }
}