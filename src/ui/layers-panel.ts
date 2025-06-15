import { Circle } from "../core/entities/Circle";
import { Line } from "../core/entities/Line";
import { Rect } from "../core/entities/Rect";
import type { Shape } from "../core/entities/Shape";
import type { ShapesRepository } from "../core/interfaces/shapes-repository";
import type { IRenderingManager } from "../core/interfaces/rendering-manager";
import type { RemoveShape } from "../core/use-cases/remove-shape";

export class LayersPanel {
    private shapesRepo: ShapesRepository;
    private renderingManager: IRenderingManager;
    private layersContainer: HTMLElement;
    private removeShape: RemoveShape;

    constructor(
        shapesRepo: ShapesRepository,
        renderingManager: IRenderingManager,
        removeShape: RemoveShape
    ) {
        this.shapesRepo = shapesRepo;
        this.renderingManager = renderingManager;
        this.removeShape = removeShape;
        this.layersContainer = document.getElementById('layers-container') as HTMLElement;

        if (!this.layersContainer) {
            console.error('Контейнер для слоев не найден');
            return;
        }

        shapesRepo.subscribe(() => this.updateLayers());

        this.updateLayers();
    }

    private updateLayers(): void {
        if (!this.layersContainer) return;

        this.layersContainer.innerHTML = '';

        const shapes = this.shapesRepo.getAll();
        const selectedShape = this.renderingManager.selectedShape;

        if (shapes.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.style.color = '#999';
            emptyMessage.style.fontSize = '13px';
            emptyMessage.style.textAlign = 'center';
            emptyMessage.style.padding = '20px 0';
            emptyMessage.textContent = 'Нет объектов';
            this.layersContainer.appendChild(emptyMessage);
            return;
        }

        shapes.forEach((shape) => {
            const layerItem = document.createElement('div');
            layerItem.className = 'layer-item';

            if (selectedShape && selectedShape.id === shape.id) {
                layerItem.classList.add('selected');
            }

            const icon = document.createElement('span');
            icon.className = 'layer-icon';

            if (shape instanceof Rect) {
                icon.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19,3H5C3.9,3,3,3.9,3,5v14c0,1.1,0.9,2,2,2h14c1.1,0,2-0.9,2-2V5C21,3.9,20.1,3,19,3z M19,19H5V5h14V19z"></path></svg>';
            } else if (shape instanceof Circle) {
                icon.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M12,20c-4.42,0-8-3.58-8-8s3.58-8,8-8s8,3.58,8,8 S16.42,20,12,20z"></path></svg>';
            } else if (shape instanceof Line) {
                icon.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19,13H5v-2h14V13z"></path></svg>';
            }

            const name = document.createElement('span');
            name.className = 'layer-name';
            name.textContent = this.getShapeName(shape);

            // Создаем кнопку удаления
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'layer-delete-btn';
            deleteBtn.innerHTML = '×';
            deleteBtn.title = 'Удалить';
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Предотвращаем выделение при удалении

                // Если удаляем выбранную фигуру, снимаем выделение
                if (selectedShape && selectedShape.id === shape.id) {
                    this.renderingManager.setSelectedShape(null);
                }

                this.removeShape.execute(shape);
            });

            layerItem.appendChild(icon);
            layerItem.appendChild(name);
            layerItem.appendChild(deleteBtn);

            layerItem.addEventListener('click', () => {
                const selectedTool = this.renderingManager.selectedShape;

                if (selectedTool && selectedTool.id === shape.id) {
                    this.renderingManager.setSelectedShape(null);
                } else {
                    this.renderingManager.setSelectedShape(shape);
                }

                this.updateLayers();
            });

            this.layersContainer.insertBefore(layerItem, this.layersContainer.firstChild);
        });
    }

    private getShapeName(shape: Shape): string {
        if (shape instanceof Rect) {
            return `Прямоугольник ${shape.id.slice(0, 4)}`;
        } else if (shape instanceof Circle) {
            return `Круг ${shape.id.slice(0, 4)}`;
        } else if (shape instanceof Line) {
            return `Линия ${shape.id.slice(0, 4)}`;
        }
        return `Фигура ${shape.id.slice(0, 4)}`;
    }
} 