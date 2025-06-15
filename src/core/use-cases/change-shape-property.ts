import type { Shape } from "../entities/Shape";
import type { ShapesRepository } from "../interfaces/shapes-repository";
import type { HistoryManager } from "./history-manager";
import { ChangeFillColorCommand } from "../entities/commands/change-fill-color-command";
import { ChangeStrokeColorCommand } from "../entities/commands/change-stroke-color-command";
import { ChangeLineWidthCommand } from "../entities/commands/change-line-width-command";
import { ChangeDimensionsCommand } from "../entities/commands/change-dimensions-command";
import type { ShapePropertyChanger } from "../interfaces/shape-property-changer";

export class ChangeShapeProperty implements ShapePropertyChanger {
    private shapesRepository: ShapesRepository;
    private historyManager: HistoryManager;

    constructor(shapesRepository: ShapesRepository, historyManager: HistoryManager) {
        this.shapesRepository = shapesRepository;
        this.historyManager = historyManager;
    }

    changeFillColor(shape: Shape, color: string): void {
        const command = new ChangeFillColorCommand(shape, this.shapesRepository, color);
        this.historyManager.execute(command);
    }

    changeStrokeColor(shape: Shape, color: string): void {
        const command = new ChangeStrokeColorCommand(shape, this.shapesRepository, color);
        this.historyManager.execute(command);
    }

    changeLineWidth(shape: Shape, width: number): void {
        const command = new ChangeLineWidthCommand(shape, this.shapesRepository, width);
        this.historyManager.execute(command);
    }

    changeDimensions(shape: Shape, width: number, height: number): void {
        const command = new ChangeDimensionsCommand(shape, this.shapesRepository, width, height);
        this.historyManager.execute(command);
    }
} 