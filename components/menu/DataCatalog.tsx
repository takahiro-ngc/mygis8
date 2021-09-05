import React, { useState } from "react";

import { layerList } from "../layer/layerList";
import PopoverButton from "./PopoverButton";
import LayerInfo from "./LayerInfo";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import TreeView from "@material-ui/lab/TreeView";
import TreeItem from "@material-ui/lab/TreeItem";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import { FlyToInterpolator } from "deck.gl";
import Chip from "@material-ui/core/Chip";
import { Typography } from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import IconButton from "@material-ui/core/IconButton";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import FlightTakeoffIcon from "@material-ui/icons/FlightTakeoff";
import { flatLayerList } from "../layer/layerList";

const DataCatalog = ({
  addLayer,
  deleteLayer,
  layers,
  setViewState,
  setIsMenuVisible,
  isMainView,
}) => {
  const jump = (lng, lat, zoom) =>
    setViewState((prev) => ({
      ...prev,
      longitude: lng,
      latitude: lat,
      zoom: zoom,
      transitionDuration: "auto",
      transitionInterpolator: new FlyToInterpolator(),
      transitionEasing: (x) =>
        x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2, //easeInOutQuad
    }));

  const [filterWord, setFilterWord] = useState("空中写真");
  // レイヤーの判定→ワードを含むか親がvisible
  // カテゴリーの判定→子がヒット：visile，展開 自分がヒット:visible：非展開
  // レイヤにワードを含む→当該データ：isVisible 親：isVisible，展開
  // カテゴリにワードを含む→当該データ:isVisible 子：isVisible，非展開 親：isVisible，展開
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
  // list.filter(
  //   (d) =>
  //     d.title.includes(filterWord) ||
  //     (d.entries && filterLayer(d.entries).length)
  // );

  // const hitInSelf = node.title.includes(filterWord);
  // const childrenList = (list) =>
  //   list.flatMap((d) => (d.entries ? childrenList(d.entries) : d));
  // const hitInChildren = childrenList.some((d) => d.title.includes(filterWord));
  // visible=hitInSelf || hitInChildren 親がhitの場合も
  // expand=hitInChildren

  // const filterdLayerList = filterLayer(layerList);
  // console.log(filterdLayerList);
  // const filterdList = flatLayerList.filter((d) => d.title.includes(filterWord));
  // console.log(filterdList);

  const renderIdList = layers.map((elm) => elm.id);
  const toggleLayer = (node) =>
    renderIdList.includes(node.id) ? deleteLayer(node.id) : addLayer(node.id);

  const renderTree = (nodes, parentIndex = 0) =>
    nodes.map((node, index) => {
      const newIndex = parentIndex + "_" + index;
      // console.log(node.entries && filterLayer(node.entries));
      return (
        <TreeItem
          // hidden={!isVisible}
          key={newIndex}
          nodeId={newIndex}
          onLabelClick={() => (node.layerType ? toggleLayer(node) : null)}
          label={
            <div
              style={{
                display: "flex",
                alignItems: "center",
                // padding: "4px 0px",
              }}
            >
              <div style={{ marginRight: "auto" }}>
                {node.title}
                {node.fileType && <Chip label={node.fileType} size="small" />}
                {node.isTile && <Chip label="タイル" size="small" />}
                {node.minZoom && <Chip label={node.minZoom} size="small" />}
              </div>

              {node.area && (
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    addLayer(node.id);
                    jump(node.area.lng, node.area.lat, node.area.zoom);
                  }}
                >
                  {<FlightTakeoffIcon />}
                </IconButton>
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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6" component="h2" display="inline">
          地図の種類
        </Typography>
        <IconButton size="small" onClick={() => setIsMenuVisible(false)}>
          {isMainView ? <ArrowBackIcon /> : <ArrowForwardIcon />}
        </IconButton>
      </div>

      <TreeView
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
      >
        {renderTree(filterdLayer)}
        {/* {renderTree(layerList)} */}
      </TreeView>
    </div>
  );
};

export default React.memo(DataCatalog);
