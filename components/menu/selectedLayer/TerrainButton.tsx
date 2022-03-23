import React from "react";

import { Stack, Switch, Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";

import { findLayer } from "../../../components/layer/layerList";
import { useLayers } from "../../../hooks/useLayers";
import { TerrainLoader } from "../../../terrain/src";
import PopoverButton from "../../commonUI/PopoverButton";

const TerrainButton = ({ index }) => {
  const layer = useLayers((state) => state.layers[index]);
  const { changeLayerProps } = useLayers();

  const isTerrain = layer?.layerType === "TerrainLayer";
  const originalMaxZoom = findLayer(layer.id)?.maxZoom;

  const setTerrain = () => {
    changeLayerProps(index, {
      // Hack idを変えないとDeck.glがlayerTypeの変更を検知しない
      id: layer.id + Math.random(),
      layerType: "TerrainLayer",
      loaders: [TerrainLoader],
      texture: layer.data,
      //標高データの対象は15まで。Math.minは、nullが0に暗黙の型変換が行われるので注意。
      maxZoom: Math.min(15, originalMaxZoom) || 15,
    });
    // 変更したidを元に戻す
    setTimeout(changeLayerProps, 1, index, { id: layer.id });
  };

  const returnTerrain = () =>
    changeLayerProps(index, {
      layerType: "TileLayer",
      loaders: null,
      maxZoom: originalMaxZoom,
    });

  const toggleTerrain = isTerrain ? returnTerrain : setTerrain;

  return (
    <PopoverButton
      button={
        <IconButton size="small" style={{ padding: 5 }}>
          {isTerrain ? "2D" : "3D"}
        </IconButton>
      }
    >
      <Stack spacing={1} direction="row" alignItems="center">
        <Typography>3D</Typography>
        <Switch checked={isTerrain} onChange={toggleTerrain} />
      </Stack>

      <Typography>地図の傾け方</Typography>
      <Typography marginBottom={1}>
        ・右ドラッグ（またはCtrlキーを押しながらドラッグ）
        <br />
        ・三本指で上下にスワイプ
      </Typography>

      <Typography>備考</Typography>
      <Typography marginBottom={1}>
        ・2Dの方が詳細を表示できることがあります。
        <br />
        ・日本陸域のみ表示されます。
      </Typography>

      <Typography>標高データの出典</Typography>

      <Typography>
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
};

export default React.memo(TerrainButton);
