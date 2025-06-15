import type { Shape } from "../../core/entities/Shape";
import type { ShapesRepository } from "../../core/interfaces/shapes-repository";

export class MemoryShapesRepository implements ShapesRepository {
    private shapes: Map<string, Shape> = new Map();
    private subscribers: (() => void)[] = [];

    subscribe(callback: () => void): void {
        this.subscribers.push(callback);
    }

    notify(): void {
        this.subscribers.forEach(cb => cb());
    }

    add(shape: Shape): void {
        this.shapes.set(shape.id, shape);
        this.notify();
    }

    remove(id: string): void {
        this.shapes.delete(id);
        this.notify();
    }

    get(id: string): Shape | null {
        return this.shapes.get(id) || null;
    }

    getAll(): Shape[] {
        return Array.from(this.shapes.values());
    }

    findByPoint(x: number, y: number): Shape | null {
        for (const shape of this.shapes.values()) {
            if (shape.isPointInside(x, y)) {
                return shape;
            }
        }
        return null;
    }
}
