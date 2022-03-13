import React from "react";
import IconButton from "@mui/material/IconButton";
import { TerrainLoader } from "../../../terrain/src";
import { useLayers } from "../../../hooks/useLayers";
import { Typography } from "@mui/material";
import PopoverButton from "../../commonUI/PopoverButton";
import { Switch } from "@mui/material";
import { Stack } from "@mui/material";
export function TerrainButton({ index }) {
  const layer = useLayers((state) => state.layers[index]);
  const changeLayerProps = useLayers((state) => state.changeLayerProps);

  const isTerrain = layer?.layerType === "TerrainLayer";
  const toggleTerrain = () => {
    const currentMaxZoom = layer.maxZoom;
    const originalMaxZoom = layer.originalMaxZoom;
    changeLayerProps(
      index,
      isTerrain
        ? {
            // hack idを変えないとレイヤーが切り替わらない
            id: layer.id.replace("_TerrainLayer", ""),
            layerType: "TileLayer",
            loaders: null,
            maxZoom: originalMaxZoom,
          }
        : {
            id: layer.id + "_TerrainLayer",
            layerType: "TerrainLayer",
            loaders: [TerrainLoader],
            texture: layer.data,
            maxZoom: 15, //標高データの対象は15まで
            originalMaxZoom: currentMaxZoom,
          }
    );
  };

  return (
    <PopoverButton
      button={
        <IconButton size="small" style={{ padding: 5 }}>
          {isTerrain ? "2D" : "3D"}
        </IconButton>
      }
    >
      <Stack spacing={2} direction="row" alignItems="center">
        <Typography>3D化</Typography>
        <Switch checked={isTerrain} onChange={toggleTerrain} />
      </Stack>

      <Typography marginTop={1}>地図の傾け方</Typography>
      <Typography>
        PC：右ドラッグ（またはShiftキーを押しながらドラッグ）
        <Typography>スマホ：三本指で上下にスワイプ</Typography>
      </Typography>

      <Typography marginTop={1}>
        2Dの方が詳細を表示できることがあります。
      </Typography>
      <Typography>日本陸域のみ表示されます。</Typography>
      <Typography variant="body2" marginTop={1}>
        標高データの出典
      </Typography>
      <Typography variant="body2">
        産業技術総合研究所の
        <a
          href="https://gbank.gsj.jp/seamless/elev/"
          target="_blank"
          rel="noreferrer"
        >
          シームレス標高タイル
        </a>
        の
        <a
          href="https://gbank.gsj.jp/seamless/elev/tile.html#h_mixed"
          target="_blank"
          rel="noreferrer"
        >
          統合DEM
        </a>
      </Typography>
    </PopoverButton>
  );
}

export default React.memo(TerrainButton);
