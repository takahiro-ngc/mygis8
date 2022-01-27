import React, { useState } from "react";
import DeckGL from "deck.gl";

import {
  GeoJsonLayer,
  ColumnLayer,
  TextLayer,
  ScatterplotLayer,
  BitmapLayer,
} from "@deck.gl/layers";
import { HexagonLayer, ScreenGridLayer } from "@deck.gl/aggregation-layers";
import {
  TileLayer,
  TerrainLayer,
  MVTLayer,
  Tile3DLayer,
} from "@deck.gl/geo-layers";
import { addDefaultProps } from "./addDefaultProps";
import { TerrainLoader } from "../../terrain/src";

export const Map = ({
  layers,
  setLayers,
  viewState,
  setViewState,
  setFeature,
  setLoadedData,
}) => {
  const cloneLayers = [...layers];
  // const testLayer = reversedLayers.map((d) => addDefaultProps(d));
  const testLayer = cloneLayers.map((d, index) => ({
    // importFileのために必要
    ...addDefaultProps(d),
    ...d,

    onDataLoad: (value) => {
      console.log("ondataload_features", value?.features);
      setLoadedData((prev) => ({ ...prev, [d.id]: value?.features }));
    },
    onViewportLoad: (data) => {
      const features = data.flatMap((d) => d?.content?.features || []);
      console.log("onViewportLoad_features", features);
      setLoadedData((prev) => ({ ...prev, [d.id]: features }));
    },

    elevationData:
      "https://cyberjapandata.gsi.go.jp/xyz/dem5a_png/{z}/{x}/{y}.png",
    // "https://cyberjapandata.gsi.go.jp/xyz/dem_png/{z}/{x}/{y}.png",

    // ...(d.layerType === "TerrainLayer" && { loaders: [TerrainLoader] }),
    // layerType: "TerrainLayer",
  }));
  const testLayer3 = testLayer.reverse(); //reverseは破壊的メソッドのため注意

  const data = {
    GeoJsonLayer,
    TileLayer,
    HexagonLayer,
    TerrainLayer,
    MVTLayer,
    ColumnLayer,
  };
  const layersWithSetting = testLayer3.map(
    (item) => new data[item.layerType](item)
  );

  const onClick = (info, e) => {
    setFeature(info);
    e.preventDefault();
    console.log(info);
  };

  const handleViewState = ({ viewState }) => setViewState(viewState);
  return (
    <div
      key="map"
      onContextMenu={(e) => e.preventDefault()} //右クリックメニューの抑止
    >
      <DeckGL
        layers={layersWithSetting}
        controller={{
          inertia: true,
          scrollZoom: { speed: 0.05, smooth: true },
          touchRotate: true,
        }}
        onClick={onClick}
        viewState={viewState}
        onViewStateChange={handleViewState}
      ></DeckGL>
    </div>
  );
};

export default React.memo(Map);
