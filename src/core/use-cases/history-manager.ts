import type { Command } from "../interfaces/command";
import type { IHistoryManager } from "../interfaces/history-manager";

export class HistoryManager implements IHistoryManager {
    private undoStack: Command[] = [];
    private redoStack: Command[] = [];
    private undoButton: HTMLButtonElement | null = null;
    private redoButton: HTMLButtonElement | null = null;

    constructor() {
        this.undoButton = document.getElementById('undo-btn') as HTMLButtonElement;
        this.redoButton = document.getElementById('redo-btn') as HTMLButtonElement;

        this.updateButtonStates();
    }

    execute(command: Command): void {
        command.execute();
        this.undoStack.push(command);
        this.redoStack = [];
        this.updateButtonStates();
    }

    undo(): void {
        const command = this.undoStack.pop();
        if (command) {
            command.undo();
            this.redoStack.push(command);
            this.updateButtonStates();
        }
    }

    redo(): void {
        const command = this.redoStack.pop();
        if (command) {
            command.execute();
            this.undoStack.push(command);
            this.updateButtonStates();
        }
    }

    canUndo(): boolean {
        return this.undoStack.length > 0;
    }

    canRedo(): boolean {
        return this.redoStack.length > 0;
    }

    clear(): void {
        this.undoStack = [];
        this.redoStack = [];
        this.updateButtonStates();
    }

    private updateButtonStates(): void {
        if (this.undoButton) {
            this.undoButton.disabled = !this.canUndo();
        }

        if (this.redoButton) {
            this.redoButton.disabled = !this.canRedo();
        }
    }
} 