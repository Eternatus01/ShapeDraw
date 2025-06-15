import type { Tool } from "../entities/Tool";

export interface IToolManager {
    getActiveTool(): Tool;
    setActiveTool(toolName: string): void;
    getTools(): Record<string, Tool>;
}