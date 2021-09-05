import React, { useState } from "react";

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
  const [filterWord, setFilterWord] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const filterChildren = (list) =>
    list.filter(
      (d) =>
        d.title.includes(filterWord) ||
        (d.entries && filterChildren(d.entries).length)
    );

  const filterdLayer = layerList
    .map((d) => {
      const filterdCildren = d.entries ? filterChildren(d.entries) : [];
      return (
        (d.title.includes(filterWord) && d) ||
        (filterdCildren.length > 0 && { ...d, entries: filterdCildren })
      );
    })
    .filter(Boolean); //配列からnullの削除

  const renderIdList = layers.map((elm) => elm.id);
  const toggleLayer = (node) =>
    renderIdList.includes(node.id) ? deleteLayer(node.id) : addLayer(node.id);

  const renderTree = (nodes, parentIndex = 0) =>
    nodes.map((node, index) => {
      const newIndex = parentIndex + "_" + index;
      return (
        <TreeItem
          key={newIndex}
          nodeId={newIndex}
          onLabelClick={() => (node.layerType ? toggleLayer(node) : null)}
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
                {node.minZoom && <Chip label={node.minZoom} size="small" />}
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
          {node.entries && renderTree(node.entries, newIndex)}
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
        setIsSearchVisible={setIsSearchVisible}
        filterWord={filterWord}
        setFilterWord={setFilterWord}
        isSearchVisible={isSearchVisible}
        setIsMenuVisible={setIsMenuVisible}
        isMainView={isMainView}
      ></Header>

      <TreeView
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
      >
        {renderTree(filterdLayer)}
      </TreeView>
    </div>
  );
};

export default React.memo(DataCatalog);
