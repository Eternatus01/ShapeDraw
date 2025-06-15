export interface InputHandler {
    subscribe(event: "mouseDown", callback: (x: number, y: number) => void): void;
    subscribe(event: "mouseMove", callback: (x: number, y: number) => void): void;
    subscribe(event: "mouseUp", callback: () => void): void;
    unsubscribe(event: "mouseDown", callback: (x: number, y: number) => void): void;
    unsubscribe(event: "mouseMove", callback: (x: number, y: number) => void): void;
    unsubscribe(event: "mouseUp", callback: () => void): void;
}