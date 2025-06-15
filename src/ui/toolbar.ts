import { ToolManager } from "../core/use-cases/tool-manager";

export class Toolbar {
    private toolManager: ToolManager
    constructor(
        toolManager: ToolManager
    ) {
        this.toolManager = toolManager
        this.setupEventListeners();
    }

    private setupEventListeners() {
        // Кнопка выбора (Select)
        document.getElementById("select-btn")?.addEventListener("click", () => {
            this.toolManager.setActiveTool("Select");
            this.updateToolbarState("Select");
        });

        // Кнопка прямоугольника (Rect)
        document.getElementById("rect-btn")?.addEventListener("click", () => {
            this.toolManager.setActiveTool("Rect");
            this.updateToolbarState("Rect");
        });

        // Кнопка линии (Line)
        document.getElementById("line-btn")?.addEventListener("click", () => {
            this.toolManager.setActiveTool("Line");
            this.updateToolbarState("Line");
        });

        // Кнопка круга (Circle)
        document.getElementById("circle-btn")?.addEventListener("click", () => {
            this.toolManager.setActiveTool("Circle");
            this.updateToolbarState("Circle");
        });
    }

    private updateToolbarState(activeToolName: string) {
        document.querySelectorAll(".toolbar .tool").forEach(element => {
            element.classList.remove("active");
        });

        const activeToolButton = document.getElementById(`${activeToolName.toLowerCase()}-btn`);
        if (activeToolButton) {
            activeToolButton.classList.add("active");
        }
    }
}