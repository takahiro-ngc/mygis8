import React from "react";

import { layerList } from "../layer/layerList";
import PopoverButton from "./PopoverButton";
import LayerInfo from "./LayerInfo";
import JumpButton from "./dataSelect/JumpButton";

import { Box } from "@mui/system";
import { Stack } from "@mui/material";
import Chip from "@mui/material/Chip";
import TreeView from "@mui/lab/TreeView";
import TreeItem from "@mui/lab/TreeItem";

import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Typography from "@mui/material/Typography";

const DataCatalog = ({ addLayer, deleteLayer, layers, setViewState }) => {
  const selectedLayerIds = layers.map((elm) => elm.id);
  const toggleLayer = (id) =>
    selectedLayerIds.includes(id) ? deleteLayer(id) : addLayer(id);

  const renderTree = (nodes) =>
    nodes.map((node, index) => {
      const key = node.category + node.title + index;
      return (
        <TreeItem
          key={key}
          nodeId={key}
          onClick={() => {
            node.data && toggleLayer(node.id);
            console.log(node);
          }}
          label={
            <Stack direction="row" alignItems="center">
              <Typography sx={{ marginRight: "auto" }}>
                {node.title}
                {/* {node.fileType && <Chip label={node.fileType} size="small" />}
                {node.isTile && <Chip label="タイル" size="small" />}
                {node.minZoom && (
                  <Chip label={`min=${node.minZoom}`} size="small" />
                )}
                {node.maxZoom && (
                  <Chip label={`max=${node.maxZoom}`} size="small" />
                )}
                {node.minZoomOriginal && (
                  <Chip label={`minO=${node.minZoomOriginal}`} size="small" />
                )}
                {node.maxZoomOriginal && (
                  <Chip label={`maxO=${node.maxZoomOriginal}`} size="small" />
                )}
                {node.maxNativeZoomOriginal && (
                  <Chip
                    label={`maxN=${node.maxNativeZoomOriginal}`}
                    size="small"
                  />
                )} */}
              </Typography>

              {node.area && (
                <JumpButton
                  addLayer={addLayer}
                  setViewState={setViewState}
                  node={node}
                ></JumpButton>
              )}

              <PopoverButton icon={<InfoOutlinedIcon />}>
                <LayerInfo node={node}></LayerInfo>
              </PopoverButton>
            </Stack>
          }
        >
          {node.entries && renderTree(node.entries)}
        </TreeItem>
      );
    });

  return (
    <Box
      sx={{
        overflowY: "scroll", //常にスクロールバーの幅が確保されることで，バーの有無でwidthが変わるのを防ぐ
        padding: "8px 0 8px 8px",
        height: "100%",
      }}
    >
      <Typography variant="h6" component="h2" display="inline">
        地図の種類
      </Typography>

      <TreeView
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
      >
        {renderTree(layerList)}
      </TreeView>
    </Box>
  );
};

export default React.memo(DataCatalog);
