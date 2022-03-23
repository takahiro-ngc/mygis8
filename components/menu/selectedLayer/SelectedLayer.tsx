import React, { useState } from "react";
import { TransitionGroup } from "react-transition-group";
import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";
import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import Collapse from "@mui/material/Collapse";
import List from "@mui/material/List";

import { useLayers } from "../../../hooks/useLayers";
import SelectedLayerItem from "./SelectedLayerItem";

export function SelectedLayer() {
  const layers = useLayers((state) => state.layers);
  const setLayers = useLayers((state) => state.setLayers);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );
  const [activeId, setActiveId] = useState(null);
  const activeIndex = layers.findIndex((layer) => layer.id === activeId);
  const handleDragStart = (event) => setActiveId(event.active.id);

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = layers.findIndex((layer) => layer.id === active.id);
      const newIndex = layers.findIndex((layer) => layer.id === over.id);
      const newlayers = arrayMove(layers, oldIndex, newIndex);
      setLayers(newlayers);
    }
    setActiveId(null);
  };

  return (
    <SimpleBar style={{ height: "100%", padding: 8 }}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={layers} strategy={verticalListSortingStrategy}>
          <List disablePadding>
            <TransitionGroup>
              {layers.map((layer, index) => (
                // key=layer.idにすると，toggleTerrainでidが変わったときにカクつく
                <Collapse key={layer.data + layer.title} timeout={500}>
                  <SelectedLayerItem
                    id={layer.id}
                    layer={layer}
                    index={index}
                    activeId={activeId}
                    isDragging={false}
                  />
                </Collapse>
              ))}
            </TransitionGroup>
          </List>
        </SortableContext>

        <DragOverlay>
          {activeId && (
            <SelectedLayerItem layer={layers[activeIndex]} isDragging={true} />
          )}
        </DragOverlay>
      </DndContext>
    </SimpleBar>
  );
}

export default React.memo(SelectedLayer);
