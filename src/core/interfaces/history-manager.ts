import type { Command } from "./command";

export interface IHistoryManager {
    execute(command: Command): void;
    undo(): void;
    redo(): void;
    canUndo(): boolean;
    canRedo(): boolean;
    clear(): void;
}