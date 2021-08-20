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

export default function DataCatalog({
  addLayer,
  deleteLayer,
  layers,
  setViewState,
  setIsMenuVisible,
}) {
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

  const renderIdList = layers.map((elm) => elm.id);

  const renderTree = (nodes, parentIndex = "") =>
    nodes.map((node, index) => (
      <TreeItem
        key={parentIndex + index}
        nodeId={parentIndex + index}
        onLabelClick={() =>
          node.type === "LayerGroup"
            ? null
            : renderIdList.includes(node.id)
            ? deleteLayer(node.id)
            : addLayer(node.id)
        }
        label={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              // minHeight: "30px", //アイコンの有無で高さが異なるのを防ぐ
            }}
          >
            <div style={{ marginRight: "auto" }}>
              {node.title}
              {node.fileType && (
                <Chip label={node.fileType} variant="outlined" size="small" />
              )}
              {node.isTile && (
                <Chip label="タイル" variant="outlined" size="small" />
              )}
              {node.minZoom && (
                <Chip label={node.minZoom} variant="outlined" size="small" />
              )}
            </div>
            {node.area && (
              <Chip
                label="移動"
                variant="outlined"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  addLayer(node.id);
                  jump(node.area.lng, node.area.lat, node.area.zoom);
                }}
              />
            )}
            <PopoverButton icon={<InfoOutlinedIcon />}>
              <LayerInfo node={node}></LayerInfo>
            </PopoverButton>
          </div>
        }
      >
        {node.entries && renderTree(node.entries, parentIndex + "_")}
      </TreeItem>
    ));

  return (
    <div
      style={{
        overflow: "auto",
        padding: "0px 8px 0px 16px",
        // height: "fit-content%",
        height: "100%",
      }}
    >
      <div style={{ padding: 8 }}>
        <Typography variant="h6" component="h2" display="inline">
          地図の種類
        </Typography>
        <div style={{ float: "right" }}>
          <IconButton size="small" onClick={() => setIsMenuVisible(false)}>
            <ArrowBackIcon />
          </IconButton>
        </div>
      </div>

      <TreeView
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
      >
        {renderTree(layerList)}
      </TreeView>
    </div>
  );
}
