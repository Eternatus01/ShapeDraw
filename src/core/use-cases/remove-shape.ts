import type { Shape } from "../entities/Shape";
import type { ShapesRepository } from "../interfaces/shapes-repository";
import { RemoveShapeCommand } from "../entities/commands/remove-shape-command";
import type { HistoryManager } from "./history-manager";

export class RemoveShape {
    private shapesRepository: ShapesRepository;
    private historyManager: HistoryManager;

    constructor(shapesRepository: ShapesRepository, historyManager: HistoryManager) {
        this.shapesRepository = shapesRepository;
        this.historyManager = historyManager;
    }

    execute(shape: Shape) {
        const command = new RemoveShapeCommand(shape, this.shapesRepository);
        this.historyManager.execute(command);
    }

    executeById(id: string) {
        const shape = this.shapesRepository.get(id);
        if (shape) {
            this.execute(shape);
        }
    }
} 