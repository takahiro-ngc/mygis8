import LayerControls from "./LayerControls";
import ListItem from "@mui/material/ListItem";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import PopoverButton from "../../commonUI/PopoverButton";

import SettingsIcon from "@mui/icons-material/Settings";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ListAltIcon from "@mui/icons-material/ListAlt";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import LayerInfo from "../../commonUI/LayerInfo";
import FeatureTable from "./FeatureTable";
import { isImage } from "../../utils/utility";
import { TerrainLoader } from "../../../terrain/src";

import FeatureTableTest from "./FeatureTabelTest";

export default function SelectedLayerItem({
  value,
  props,
  index,
  isDragged,
  handleLayer,
  layers,
  storedData,
  setViewState,
}) {
  const isVisible = layers[index]?.visible ?? true; //undefinedの時はデフォルトのtrueにする

  const isTerrain = layers[index].layerType === "TerrainLayer";
  const toggleTerrain = () => {
    let clone = [...layers];
    clone[index].layerType = isTerrain ? "TileLayer" : "TerrainLayer";
    clone[index].loaders = isTerrain ? null : [TerrainLoader];
    clone[index].texture = clone[index].data;
    clone[index].color = [255, 255, 255, 0];
    // 単にlayerTypeを変えても更新されないため，idを変えることで，deck.glに別レイヤーと認識させるHack
    clone[index].id = Math.random();
    handleLayer.setLayers(clone);
  };

  const reversedIndex = layers.length - 1 - index;

  return (
    <ListItem
      {...props}
      style={{
        ...props.style,
        padding: "2px 8px 2px 0px",
        zIndex: 10, //ドラッグ時にitemが埋まるのを防ぐ
      }}
    >
      <IconButton
        size="small"
        data-movable-handle
        style={{ cursor: isDragged ? "grabbing" : "grab" }}
      >
        <DragHandleIcon />
      </IconButton>
      {/* レイヤー名表示 */}
      <div
        style={{
          marginRight: "auto",
          // cursor: props.isDragged ? "grabbing" : "grab",
          overflowWrap: "anywhere",
        }}
        // data-movable-handle
      >
        {value.title}
      </div>

      {/* 表示切替ボタン */}
      <IconButton
        size="small"
        onClick={(e) => {
          let newSetting = [...layers];
          newSetting[index].visible = !isVisible;
          handleLayer.setLayers(newSetting);
        }}
      >
        {isVisible ? <VisibilityIcon /> : <VisibilityOffIcon />}
      </IconButton>

      {/* 3D切替ボタン */}
      {isImage(value.data) && (
        <IconButton size="small" onClick={toggleTerrain} style={{ padding: 5 }}>
          {isTerrain ? "2D" : "3D"}
        </IconButton>
      )}

      {/* 表ボタン*/}
      {!!storedData[value.id]?.length && (
        <PopoverButton
          button={<IconButton size="small" children={<ListAltIcon />} />}
          width={1000}
        >
          <FeatureTable features={storedData[value.id]} />
        </PopoverButton>
      )}

      {/* 設定切替ボタン */}
      <PopoverButton
        button={<IconButton size="small" children={<SettingsIcon />} />}
      >
        <LayerControls
          index={index}
          layers={layers}
          handleLayer={handleLayer}
        />
      </PopoverButton>

      {/* 情報表示ボタン */}
      <PopoverButton
        button={<IconButton size="small" children={<InfoOutlinedIcon />} />}
      >
        <LayerInfo node={value} />
      </PopoverButton>

      {/* 閉じるボタン */}
      <IconButton
        size="small"
        onClick={() => handleLayer.toggleLayer(value.id)}
      >
        <CloseIcon />
      </IconButton>
    </ListItem>
  );
}
