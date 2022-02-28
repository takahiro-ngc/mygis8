import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import SelectedLayerItem from "./SelectedLayerItem";
import { DriveEtaTwoTone } from "@mui/icons-material";
import ListItem from "@mui/material/ListItem";
import IconButton from "@mui/material/IconButton";
import DragHandleIcon from "@mui/icons-material/DragHandle";

export function SortableItem({ id, activeId, index, layer }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <ListItem
      ref={setNodeRef}
      style={{
        ...style,
        padding: "2px 8px 2px 0px",
        opacity: activeId === layer.id && 0.3,
      }}
    >
      <span className="style">
        <IconButton
          size="small"
          disableTouchRipple
          {...attributes}
          {...listeners}
          sx={{
            cursor: "grab",
            "&:active": {
              cursor: "grabbing",
            },
          }}
        >
          <DragHandleIcon />
        </IconButton>
      </span>
      {/* レイヤー名表示 */}
      <div
        style={{
          marginRight: "auto",
          overflowWrap: "anywhere",
        }}
      >
        {layer.title}
      </div>
      <IconButton size="small">
        <DragHandleIcon />
      </IconButton>
    </ListItem>
  );
}
