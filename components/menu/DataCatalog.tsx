import React from "react";

import { layerList } from "../layer/layerList";
import PopoverButton from "./PopoverButton";
import LayerInfo from "./LayerInfo";

import Chip from "@material-ui/core/Chip";
import TreeView from "@material-ui/lab/TreeView";
import TreeItem from "@material-ui/lab/TreeItem";

import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import Header from "./dataSelect/Header";
import JumpButton from "./dataSelect/JumpButton";

const DataCatalog = ({
  addLayer,
  deleteLayer,
  layers,
  setViewState,
  setIsMenuVisible,
  isMainView,
}) => {
  const renderIdList = layers.map((elm) => elm.id);
  const toggleLayer = (node) =>
    renderIdList.includes(node.id) ? deleteLayer(node.id) : addLayer(node.id);

  const renderTree = (nodes) =>
    nodes.map((node, index) => {
      const key = node.category + node.title + index;
      return (
        <TreeItem
          hidden={!(node.type === "LayerGroup" || node.fileType === "png")}
          key={key}
          nodeId={key}
          onLabelClick={() => {
            node.layerType ? toggleLayer(node) : null;
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
      <Header
        setIsMenuVisible={setIsMenuVisible}
        isMainView={isMainView}
      ></Header>

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
