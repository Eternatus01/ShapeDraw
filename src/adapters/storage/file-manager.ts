import { Shape } from "../../core/entities/Shape";
import { Rect } from "../../core/entities/Rect";
import { Line } from "../../core/entities/Line";
import { Circle } from "../../core/entities/Circle";
import type { ShapesRepository } from "../../core/interfaces/shapes-repository";
import type { IHistoryManager } from "../../core/interfaces/history-manager";
import type { RenderingManager } from "../renderers/rendering-manager";
import type { IToolManager } from "../../core/interfaces/tool-manager";

export interface ProjectData {
    version: string;
    canvasWidth: number;
    canvasHeight: number;
    shapes: Shape[];
    timestamp: string;
}

export class FileManager {
    private canvas: HTMLCanvasElement;
    private repo: ShapesRepository;
    private historyManager: IHistoryManager;
    private renderingManager: RenderingManager;
    private fileInput: HTMLInputElement;
    private toolManager: IToolManager;

    constructor(
        canvas: HTMLCanvasElement,
        repo: ShapesRepository,
        historyManager: IHistoryManager,
        renderingManager: RenderingManager,
        toolManager: IToolManager
    ) {
        this.canvas = canvas;
        this.repo = repo;
        this.historyManager = historyManager;
        this.renderingManager = renderingManager;
        this.toolManager = toolManager;

        this.fileInput = document.createElement('input');
        this.fileInput.type = 'file';
        this.fileInput.accept = '.json';
        this.fileInput.style.display = 'none';
        document.body.appendChild(this.fileInput);

        this.fileInput.addEventListener('change', (e) => {
            const target = e.target as HTMLInputElement;
            if (target.files && target.files.length > 0) {
                this.importFromJSON(target.files[0]);
            }
        });

        this.setupEventListeners();
    }

    private setupEventListeners(): void {
        const exportPngButton = document.getElementById('export-png');
        if (exportPngButton) {
            exportPngButton.addEventListener('click', () => this.exportToPNG());
        }

        const exportJsonButton = document.getElementById('export-json');
        if (exportJsonButton) {
            exportJsonButton.addEventListener('click', () => this.exportToJSON());
        }

        const importJsonButton = document.getElementById('import-json');
        if (importJsonButton) {
            importJsonButton.addEventListener('click', () => {
                this.fileInput.click();
            });
        }
    }

    private showToast(message: string, isError = false): void {
        const toast = document.createElement('div');
        toast.className = `toast-message ${isError ? 'error' : ''}`;
        toast.textContent = message;

        document.body.appendChild(toast);

        setTimeout(() => {
            document.body.removeChild(toast);
        }, 3000);
    }

    public exportToPNG(): void {
        try {
            const dataURL = this.canvas.toDataURL('image/png');

            const downloadLink = document.createElement('a');

            const date = new Date();
            const fileName = `canvas_${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}_${date.getHours()}-${date.getMinutes()}.png`;

            downloadLink.href = dataURL;
            downloadLink.download = fileName;
            downloadLink.style.display = 'none';

            document.body.appendChild(downloadLink);
            downloadLink.click();

            setTimeout(() => {
                document.body.removeChild(downloadLink);
            }, 100);

            this.showToast('Изображение успешно экспортировано');

        } catch (error) {
            console.error('Ошибка при экспорте изображения:', error);
            this.showToast('Ошибка при экспорте изображения', true);
        }
    }

    public exportToJSON(): void {
        try {
            const shapes = this.repo.getAll();

            const projectData: ProjectData = {
                version: '1.0',
                canvasWidth: this.canvas.width,
                canvasHeight: this.canvas.height,
                shapes: shapes,
                timestamp: new Date().toISOString()
            };

            const jsonString = JSON.stringify(projectData, null, 2);

            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            const downloadLink = document.createElement('a');
            const date = new Date();
            const fileName = `shapedraw_${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}_${date.getHours()}-${date.getMinutes()}.json`;

            downloadLink.href = url;
            downloadLink.download = fileName;
            downloadLink.style.display = 'none';

            document.body.appendChild(downloadLink);
            downloadLink.click();

            setTimeout(() => {
                document.body.removeChild(downloadLink);
                URL.revokeObjectURL(url);
            }, 100);

            this.showToast('Проект успешно сохранен');

        } catch (error) {
            console.error('Ошибка при экспорте в JSON:', error);
            this.showToast('Не удалось сохранить проект', true);
        }
    }

    private createShapeFromData(shapeData: any): Shape | null {
        try {
            switch (shapeData.type) {
                case 'Rect':
                    return new Rect(
                        shapeData.id,
                        shapeData.x || 0,
                        shapeData.y || 0,
                        shapeData.width || 0,
                        shapeData.height || 0,
                        shapeData.color || '#ffffff',
                        shapeData.lineWidth || 1,
                        shapeData.lineColor || '#000000'
                    );
                case 'Line':
                    return new Line(
                        shapeData.id,
                        shapeData.x || 0,
                        shapeData.y || 0,
                        shapeData.x2 || 0,
                        shapeData.y2 || 0,
                        shapeData.color || '#000000',
                        shapeData.lineWidth || 1
                    );
                case 'Circle':
                    return new Circle(
                        shapeData.id,
                        shapeData.x || 0,
                        shapeData.y || 0,
                        shapeData.radius || 0,
                        shapeData.color || '#ffffff',
                        shapeData.lineWidth || 1,
                        shapeData.lineColor || '#000000'
                    );
                default:
                    console.warn(`Неизвестный тип фигуры: ${shapeData.type}`);
                    return null;
            }
        } catch (error) {
            console.error('Ошибка при создании фигуры из данных:', error);
            return null;
        }
    }

    private importFromJSON(file: File): void {
        const reader = new FileReader();

        reader.onload = (event) => {
            try {
                if (!event.target || typeof event.target.result !== 'string') {
                    throw new Error('Не удалось прочитать файл');
                }

                const projectData = JSON.parse(event.target.result) as ProjectData;

                if (!projectData.version) {
                    throw new Error('Некорректный формат файла проекта');
                }

                const currentShapes = [...this.repo.getAll()];
                currentShapes.forEach(shape => {
                    this.repo.remove(shape.id);
                });

                if (projectData.canvasWidth && projectData.canvasHeight) {
                    this.canvas.width = projectData.canvasWidth;
                    this.canvas.height = projectData.canvasHeight;
                }

                if (Array.isArray(projectData.shapes)) {
                    projectData.shapes.forEach(shapeData => {
                        if (shapeData && typeof shapeData === 'object' && 'type' in shapeData) {
                            const shape = this.createShapeFromData(shapeData as any);
                            if (shape) {
                                this.repo.add(shape);
                            }
                        } else {
                            console.warn('Пропущена фигура без свойства type:', shapeData);
                        }
                    });
                }

                this.historyManager.clear();

                this.renderingManager.setShapes(this.repo.getAll());

                this.toolManager.setActiveTool("Select");

                this.showToast(`Проект успешно загружен (${projectData.shapes?.length || 0} фигур)`);

            } catch (error) {
                console.error('Ошибка при импорте из JSON:', error);
                this.showToast('Не удалось импортировать проект', true);
            }
        };

        reader.onerror = () => {
            console.error('Ошибка при чтении файла');
            this.showToast('Не удалось прочитать файл', true);
        };

        reader.readAsText(file);
    }
} 