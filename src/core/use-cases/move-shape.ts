import type { Shape } from "../entities/Shape";
import type { ShapesRepository } from "../interfaces/shapes-repository";
import { MoveShapeCommand } from "../entities/commands/move-shape-command";
import type { HistoryManager } from "./history-manager";

export class MoveShape {
    private shapesRepository: ShapesRepository;
    private historyManager: HistoryManager;

    constructor(shapesRepository: ShapesRepository, historyManager: HistoryManager) {
        this.shapesRepository = shapesRepository;
        this.historyManager = historyManager;
    }

    execute(shape: Shape, dx: number, dy: number) {
        const command = new MoveShapeCommand(shape, this.shapesRepository, dx, dy);
        this.historyManager.execute(command);
    }

    executeById(id: string, dx: number, dy: number) {
        const shape = this.shapesRepository.get(id);
        if (shape) {
            this.execute(shape, dx, dy);
        }
    }
} 