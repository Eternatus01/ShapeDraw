import { CanvasInputHandler } from "./adapters/input/canvas-input-handler";
import { CanvasRenderer } from "./adapters/renderers/canvas-renderer";
import { RenderingManager } from "./adapters/renderers/rendering-manager";
import { FileManager } from "./adapters/storage/file-manager";
import { MemoryShapesRepository } from "./adapters/storage/memory-shapes-repository";
import type { Tool } from "./core/entities/Tool";
import { ToolCircle } from "./ui/tools/tool-circle";
import { ToolLine } from "./ui/tools/tool-line";
import { ToolRect } from "./ui/tools/tool-rect";
import { ToolSelect } from "./ui/tools/tool-select";
import { AddShape } from "./core/use-cases/add-shape";
import { ChangeShapeProperty } from "./core/use-cases/change-shape-property";
import { HistoryManager } from "./core/use-cases/history-manager";
import { MoveShape } from "./core/use-cases/move-shape";
import { RemoveShape } from "./core/use-cases/remove-shape";
import { ToolManager } from "./core/use-cases/tool-manager";
import { CanvasView } from "./ui/canvas-view";
import { Toolbar } from "./ui/toolbar";
import { LayersPanel } from "./ui/layers-panel";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
if (!canvas) {
  throw new Error("Canvas element not found");
}

const ctx = canvas.getContext("2d");
if (!ctx) {
  throw new Error("Could not get 2D context from canvas");
}

// Создаем основные компоненты
const renderer = new CanvasRenderer(ctx);
const renderingManager = new RenderingManager(renderer);
const repo = new MemoryShapesRepository();
const canvasInput = new CanvasInputHandler(canvas);
const historyManager = new HistoryManager();
const addShape = new AddShape(repo, historyManager);
const removeShape = new RemoveShape(repo, historyManager);
const moveShape = new MoveShape(repo, historyManager);
const changeShapeProperty = new ChangeShapeProperty(repo, historyManager);

// Создаем инструменты
const tools: Record<string, Tool> = {
  Select: new ToolSelect(canvasInput, addShape, repo, renderingManager, moveShape, changeShapeProperty, removeShape),
  Rect: new ToolRect(canvasInput, addShape, renderingManager),
  Line: new ToolLine(canvasInput, addShape, renderingManager),
  Circle: new ToolCircle(canvasInput, addShape, renderingManager),
};

// Инициализация UI
const toolManager = new ToolManager(tools);
new Toolbar(toolManager);
new CanvasView(repo, renderingManager);
new LayersPanel(repo, renderingManager, removeShape);

// Создаем менеджер файлов для импорта/экспорта
new FileManager(canvas, repo, historyManager, renderingManager, toolManager);

// Настраиваем кнопки undo/redo
const undoButton = document.getElementById('undo-btn');
const redoButton = document.getElementById('redo-btn');

if (undoButton) {
  undoButton.addEventListener('click', () => {
    historyManager.undo();
  });
}

if (redoButton) {
  redoButton.addEventListener('click', () => {
    historyManager.redo();
  });
}

// Настраиваем горячие клавиши для undo/redo
document.addEventListener('keydown', (e) => {
  // Ctrl+Z или Cmd+Z для отмены
  if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.keyCode === 90) && !e.shiftKey) {
    e.preventDefault();
    historyManager.undo();
  }

  // Ctrl+Shift+Z или Cmd+Shift+Z для повтора
  if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.keyCode === 90) && e.shiftKey) {
    e.preventDefault();
    historyManager.redo();
  }
});

// Добавляем поддержку клавиатурных сокращений для инструментов
document.addEventListener('keydown', (e) => {
  if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
    return;
  }

  switch (e.keyCode) {
    case 83: // 'S' 
      toolManager.setActiveTool("Select");
      break;
    case 82: // 'R' 
      toolManager.setActiveTool("Rect");
      break;
    case 76: // 'L' 
      toolManager.setActiveTool("Line");
      break;
    case 67: // 'C' 
      toolManager.setActiveTool("Circle");
      break;
  }
});

// Инициализируем начальное состояние
repo.subscribe(() => renderingManager.setShapes(repo.getAll()));
renderingManager.setShapes(repo.getAll());
renderingManager.startRendering();

// Активируем инструмент выбора по умолчанию
toolManager.setActiveTool("Select");