import React, { useMemo } from "react";

import { layerList } from "../layer/layerList";
import PopoverButton from "./PopoverButton";
import LayerInfo from "./LayerInfo";

import Chip from "@mui/material/Chip";
import TreeView from "@mui/lab/TreeView";
import TreeItem from "@mui/lab/TreeItem";

import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import InfoIcon from "@mui/icons-material/Info";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Header from "./dataSelect/Header";
import JumpButton from "./dataSelect/JumpButton";

const DataCatalog = ({
  addLayer,
  deleteLayer,
  layers,
  setViewState,
  setIsMenuVisible,
}) => {
  const renderIdList = layers.map((elm) => elm.id);
  const toggleLayer = (node) =>
    renderIdList.includes(node.id) ? deleteLayer(node.id) : addLayer(node.id);

  const renderTree = (nodes) =>
    nodes.map((node, index) => {
      const key = node.category + node.title + index;
      return (
        <TreeItem
          // hidden={!(node.layerType === "LayerGroup" || node.fileType === "png")} //デバッグ用
          key={key}
          nodeId={key}
          onClick={() => {
            node.data ? toggleLayer(node) : null;
            console.log(node);
          }}
          label={
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <div style={{ marginRight: "auto" }}>
                {node.title}
                {node.fileType && <Chip label={node.fileType} size="small" />}
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
                )}
              </div>

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
            </div>
          }
        >
          {node.entries && renderTree(node.entries)}
        </TreeItem>
      );
    });

  return (
    <div
      style={{
        overflowY: "scroll", //常にスクロールバーの幅が確保されることで，バーの有無でwidthが変わるのを防ぐ
        padding: "8px 8px 8px 8px",
        height: "100%",
      }}
    >
      <Header setIsMenuVisible={setIsMenuVisible}></Header>

      <TreeView
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
      >
        {renderTree(layerList)}
      </TreeView>
    </div>
  );
};

export default React.memo(DataCatalog);
