import type { Command } from "../../interfaces/command";

export class CompositeCommand implements Command {
    private commands: Command[];

    constructor(commands: Command[]) {
        this.commands = [...commands];
    }

    execute(): void {
        for (const command of this.commands) {
            command.execute();
        }
    }

    undo(): void {
        // Отменяем команды в обратном порядке
        for (let i = this.commands.length - 1; i >= 0; i--) {
            this.commands[i].undo();
        }
    }
} 