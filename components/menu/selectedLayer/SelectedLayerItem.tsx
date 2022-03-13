import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import ListItem from "@mui/material/ListItem";
import IconButton from "@mui/material/IconButton";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import { isImage } from "../../utils/utility";
import { TerrainLoader } from "../../../terrain/src";
import CloseIcon from "@mui/icons-material/Close";
import LayerControls from "./layerControls/LayerControls";

import PopoverButton from "../../commonUI/PopoverButton";
import FeatureTable from "./FeatureTable";
import ListAltIcon from "@mui/icons-material/ListAlt";
import SettingsIcon from "@mui/icons-material/Settings";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LayerInfo from "../../commonUI/LayerInfo";
import { Typography } from "@mui/material";
import { useLayers } from "../../../hooks/useLayers";
import { ClickAwayListener } from "@mui/material";
import { TerrainButton } from "./TerrainButton";

export function SelectedLayerItem({ id, activeId, index, layer, isDragging }) {
  // dnd-kitの設定
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // const layer = useLayers((state) => state.layers[index]);
  const toggleLayer = useLayers((state) => state.toggleLayer);
  const loadedFeature = useLayers((state) => state.loadedFeature);
  const changeLayerProps = useLayers((state) => state.changeLayerProps);
  const handleClickAway = () =>
    changeLayerProps(index, {
      highlightedObjectIndex: null,
    });

  const isTerrain = layer.layerType === "TerrainLayer";
  const toggleTerrain = () => {
    changeLayerProps(
      index,
      isTerrain
        ? {
            // hack idを変えないとレイヤーが切り替わらない
            id: layer.id.replace("_TerrainLayer", ""),
            layerType: "TileLayer",
            loaders: null,
          }
        : {
            id: layer.id + "_TerrainLayer",
            layerType: "TerrainLayer",
            loaders: [TerrainLoader],
            texture: layer.data,
            color: [255, 255, 255, 0],
          }
    );
  };

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

      <Typography sx={{ marginRight: "auto", overflowWrap: "anywhere" }}>
        {layer.title}
      </Typography>

      {isImage(layer.data) && <TerrainButton index={index} />}

      {/* ToDo localGeojson対応 */}
      {/* {!!loadedFeature[layer.id]?.length && ( */}
      <ClickAwayListener onClickAway={handleClickAway}>
        {/* ClickAwayListenerは Needs to be able to hold a ref. */}
        <div>
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
        </div>
      </ClickAwayListener>
      {/* )} */}

      {layer.layerType === "EditableGeoJsonLayer" && (
        <IconButton
          size="small"
          onClick={() =>
            changeLayerProps(index, {
              onEdit: ({ updatedData }) =>
                changeLayerProps(index, { data: updatedData }),
            })
          }
        >
          <SettingsIcon />
        </IconButton>
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

      <IconButton size="small" onClick={() => toggleLayer(layer.id)}>
        <CloseIcon />
      </IconButton>
    </ListItem>
  );
}

export default React.memo(SelectedLayerItem);
