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

import { SortableItem } from "./SortableItem";

export function SelectedLayerTest({
  layers,
  storedData,
  setLayers,
  toggleLayer,
  setViewState,
}) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
    // ToDo
    useSensor(TouchSensor, {
      // Press delay of 250ms, with tolerance of 5px of movement
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
      setLayers((layers) => {
        const oldIndex = layers.findIndex((layer) => layer.id === active.id);
        const newIndex = layers.findIndex((layer) => layer.id === over.id);
        console.log(active, active.id);
        return arrayMove(layers, oldIndex, newIndex);
      });
    }
    setActiveId(null);
  };

  return (
    <SimpleBar style={{ height: "100%", padding: "8px 0 8px 8px" }}>
      <Typography variant="h6" component="h2">
        選択中の地図
      </Typography>

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
                  <SortableItem
                    key={layer.id}
                    id={layer.id}
                    layer={layer}
                    index={index}
                    activeId={activeId}
                    storedData={storedData}
                    toggleLayer={toggleLayer}
                  />
                </Collapse>
              ))}
            </TransitionGroup>
          </List>
        </SortableContext>

        <DragOverlay>
          {activeId ? (
            <div
            // style={{
            //   cursor: "grabbing",
            //   backgroundColor: "rgba(30, 30, 30)",
            //   borderRadius: 4,
            // }}
            >
              <SortableItem
                layer={layers[activeIndex]}
                storedData={storedData}
                isDragging={true}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </SimpleBar>
  );
}
