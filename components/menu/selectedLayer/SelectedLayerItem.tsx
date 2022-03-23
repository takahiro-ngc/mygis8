import React from "react";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import CloseIcon from "@mui/icons-material/Close";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ListAltIcon from "@mui/icons-material/ListAlt";
import SettingsIcon from "@mui/icons-material/Settings";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";

import { useLayers } from "../../../hooks/useLayers";
import LayerInfo from "../../commonUI/LayerInfo";
import PopoverButton from "../../commonUI/PopoverButton";
import { isImage } from "../../utils/utility";
import FeatureTable from "./FeatureTable";
import LayerControls from "./layerControls/LayerControls";
import TerrainButton from "./TerrainButton";

export function SelectedLayerItem({ id, activeId, index, layer, isDragging }) {
  // dnd-kitの設定
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // const layer = useLayers((state) => state.layers[index]);
  const { deleteLayer, loadedFeature } = useLayers();

  return (
    <ListItem
      ref={setNodeRef}
      style={{
        ...style,
        padding: "2px 8px 2px 0px",
        opacity: activeId === layer.id && 0.3,
        touchAction: "none", //dnd kitで必要
        ...(isDragging && {
          backgroundColor: "rgba(30, 30, 30)",
          borderRadius: 4,
        }),
      }}
    >
      <IconButton
        size="small"
        disableTouchRipple
        {...attributes}
        {...listeners}
        sx={{
          cursor: isDragging ? "grabbing" : "grab",
        }}
      >
        <DragHandleIcon />
      </IconButton>

      <Typography sx={{ marginRight: "auto", wordBreak: "break-all" }}>
        {layer.title}
      </Typography>

      {isImage(layer.data) && <TerrainButton index={index} />}

      {!!loadedFeature[layer.id]?.length && (
        <PopoverButton
          button={
            <IconButton size="small">
              <ListAltIcon />
            </IconButton>
          }
          width={1000}
        >
          <FeatureTable layer={layer} index={index} />
        </PopoverButton>
      )}

      <PopoverButton
        button={
          <IconButton size="small">
            <SettingsIcon />
          </IconButton>
        }
      >
        <LayerControls index={index} />
      </PopoverButton>

      <PopoverButton
        button={
          <IconButton size="small">
            <InfoOutlinedIcon />
          </IconButton>
        }
      >
        <LayerInfo node={layer} />
      </PopoverButton>

      <IconButton size="small" onClick={() => deleteLayer(layer.id)}>
        <CloseIcon />
      </IconButton>
    </ListItem>
  );
}

export default React.memo(SelectedLayerItem);
