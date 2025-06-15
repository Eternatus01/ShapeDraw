import type { Shape } from "../entities/Shape";
import type { ShapesRepository } from "../interfaces/shapes-repository";
import { AddShapeCommand } from "../entities/commands/add-shape-command";
import type { HistoryManager } from "./history-manager";

export class AddShape {
    private shapesRepository: ShapesRepository;
    private historyManager: HistoryManager;

    constructor(shapesRepository: ShapesRepository, historyManager: HistoryManager) {
        this.shapesRepository = shapesRepository;
        this.historyManager = historyManager;
    }

    execute(shape: Shape) {
        const command = new AddShapeCommand(shape, this.shapesRepository);
        this.historyManager.execute(command);
    }
}