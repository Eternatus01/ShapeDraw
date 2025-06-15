import type { Tool } from "../entities/Tool";
import type { IToolManager } from "../interfaces/tool-manager";

export class ToolManager implements IToolManager {
    private tools: Record<string, Tool>;
    private activeTool: Tool | null = null;
    private activeToolButton: HTMLElement | null = null;

    constructor(tools: Record<string, Tool>) {
        this.tools = tools;
    }

    getActiveTool(): Tool {
        if (!this.activeTool) {
            throw new Error("No active tool selected");
        }
        return this.activeTool;
    }

    setActiveTool(toolName: string): void {
        const tool = this.tools[toolName];
        if (!tool) {
            console.error(`Tool ${toolName} not found`);
            return;
        }

        // Деактивируем текущий инструмент, если есть
        if (this.activeTool) {
            this.activeTool.deactivate();
        }

        // Обновляем активный инструмент
        this.activeTool = tool;
        this.activeTool.activate();

        // Обновляем UI
        if (this.activeToolButton) {
            this.activeToolButton.classList.remove('active');
        }

        const toolButton = document.getElementById(`${toolName.toLowerCase()}-btn`);
        if (toolButton) {
            toolButton.classList.add('active');
            this.activeToolButton = toolButton;
        }
    }

    getTools(): Record<string, Tool> {
        return this.tools;
    }
}