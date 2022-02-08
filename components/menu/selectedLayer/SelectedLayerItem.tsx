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
import LayerInfo from "../../commonUI/LayerInfo";
import FeatureTable from "./FeatureTable";
import { isImage } from "../../utils/utility";
import { TerrainLoader } from "../../../terrain/src";

export default function SelectedLayerItem({
  value,
  props,
  index,
  isDragged,
  toggleLayers,
  layers,
  setLayers,
  // loadedData,
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
    setLayers(clone);
  };

  return (
    <ListItem
      {...props}
      style={{
        ...props.style,
        padding: "2px 8px 2px 0px",
        zIndex: 10, //ドラッグ時にitemが埋まるのを防ぐ
      }}
    >
      {/* 表示切替ボタン */}
      <IconButton
        size="small"
        onClick={(e) => {
          let newSetting = [...layers];
          newSetting[index].visible = !isVisible;
          setLayers(newSetting);
        }}
      >
        {isVisible ? <VisibilityIcon /> : <VisibilityOffIcon />}
      </IconButton>

      {/* レイヤー名表示 */}

      <div
        style={{
          marginRight: "auto",
          cursor: isDragged ? "grabbing" : "grab",
          overflowWrap: "anywhere",
        }}
        data-movable-handle
      >
        {value.title}
      </div>

      {/* 3D切替ボタン */}
      {isImage(value.data) && (
        <IconButton size="small" onClick={toggleTerrain} style={{ padding: 5 }}>
          {isTerrain ? "2D" : "3D"}
        </IconButton>
      )}

      {/* 表ボタン*/}
      {/* {!!loadedData[value.id]?.length && (
        <PopoverButton icon={<ListAltIcon />} style={{ width: "800px" }}>
          <FeatureTable
            features={loadedData[value.id]}
            setViewState={setViewState}
          />
        </PopoverButton>
      )} */}

      {/* 設定切替ボタン */}
      <PopoverButton icon={<SettingsIcon />}>
        <LayerControls index={index} layers={layers} setLayers={setLayers} />
      </PopoverButton>

      {/* 情報表示ボタン */}
      <PopoverButton icon={<InfoOutlinedIcon />}>
        <LayerInfo node={value}></LayerInfo>
      </PopoverButton>

      {/* 閉じるボタン */}
      <IconButton size="small" onClick={() => toggleLayers(value.id)}>
        <CloseIcon />
      </IconButton>
    </ListItem>
  );
}
