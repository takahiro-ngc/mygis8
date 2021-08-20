import LayerControls from "./LayerControls";
// import Histry from "./Histry";
import ListItem from "@material-ui/core/ListItem";
import JSONTree from "react-json-tree";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import PopoverButton from "../PopoverButton";

import SettingsIcon from "@material-ui/icons/Settings";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import LayerInfo from "../LayerInfo";
// import { isBitmap } from "../utils/utility";

export default function SelectedLayerItem({
  value,
  props,
  index,
  isDragged,
  isSelected,
  deleteLayer,
  layers,
  setLayers,
  storedHistry,
  addLayer,
  setHistry,
}) {
  const isVisible = (item) => item.visible ?? true; //undefinedの時はデフォルトのtrueにする

  // ToDo ユーティリティ化
  const toggle3d = (index) => {
    let clone = [...layers];
    clone[index].layerType =
      clone[index].layerType === "GsiTerrainLayer"
        ? "TileLayer"
        : "GsiTerrainLayer";
    // 描画できないエラーを防ぐため，一旦削除するHack
    new Promise<void>((resolve, reject) => {
      resolve();
    })
      .then(() => {
        deleteLayer(layers[index].id);
      })
      .then(() => {
        setLayers(clone);
      });
  };
  const is3d = (index) => layers[index].layerType === "GsiTerrainLayer";

  return (
    <ListItem
      {...props}
      style={{
        ...props.style,
        padding: "2px 8px 2px 16px",
        zIndex: 10, //ドラッグ時にitemが埋まるのを防ぐ
      }}
    >
      {/* 表示切替ボタン */}
      <IconButton
        size="small"
        onClick={(e) => {
          let newSetting = [...layers];
          newSetting[index].visible = !isVisible(value);
          setLayers(newSetting);
        }}
      >
        {isVisible(value) ? <VisibilityIcon /> : <VisibilityOffIcon />}
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
      {/* {isBitmap(value.data) && (
        <IconButton
          size="small"
          onClick={() => toggle3d(unReversedIndex)}
          style={{ padding: 5 }}
        >
          {is3d(unReversedIndex) ? "2D" : "3D"}
        </IconButton>
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
      <IconButton size="small" onClick={() => deleteLayer(value.id)}>
        <CloseIcon />
      </IconButton>
    </ListItem>
  );
}