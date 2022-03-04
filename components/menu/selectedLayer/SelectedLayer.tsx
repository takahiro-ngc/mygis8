import React, { useState } from "react";
import List from "@mui/material/List";
import { TransitionGroup } from "react-transition-group";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import Collapse from "@mui/material/Collapse";
import { Typography } from "@mui/material";
import SimpleBar from "simplebar-react";

import SelectedLayerItem from "./SelectedLayerItem";
import { useLayers } from "../../../hooks/useLayers";

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
  console.log(layers);
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
      {/* <Typography variant="h6" component="h2">
        選択中の地図
      </Typography> */}

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
                <Collapse key={layer.id} id={layer.id} timeout={500}>
                  <SelectedLayerItem
                    key={layer.id}
                    id={layer.id}
                    layer={layer}
                    index={index}
                    activeId={activeId}
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
