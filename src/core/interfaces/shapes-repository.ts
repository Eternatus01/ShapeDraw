import type { Shape } from "../entities/Shape";

export interface ShapesRepository {
    add(shape: Shape): void;
    remove(id: string): void;
    get(id: string): Shape | null;
    getAll(): Shape[];
    findByPoint(x: number, y: number): Shape | null;
    subscribe(callback: () => void): void;
    notify(): void;
}