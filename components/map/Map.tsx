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
import { backgroundLayer } from "./backgroundLayer";
import { addDefaultProps } from "./addDefaultProps";

export const Map = ({
  layers,
  setLayers,
  viewState,
  setViewState,
  setFeature,
  setLoadedData,
}) => {
  const cloneLayers = [...layers]; //reverseは破壊的メソッドのため注意
  const reversedLayers = cloneLayers.reverse();
  const testLayer = reversedLayers.map((d) => addDefaultProps(d));
  const testLayer3 = testLayer.map((d) => ({
    ...d,
    onDataLoad: (value) =>
      setLoadedData((prev) => ({ ...prev, [d.id]: value?.features })),
    onViewportLoad: (data) => {
      const features = data.flatMap((d) => d?.content?.features || []);
      setLoadedData((prev) => ({ ...prev, [d.id]: features }));
    },
  }));
  const testLayer2 = testLayer3.map((d) =>
    d.target ? { ...d, getFillColor: d.target } : d
  );
  // console.log("testLayer2", testLayer2);
  const layersWithSetting = testLayer2.map((item: any, index: number) => {
    switch (item.layerType) {
      case "GeoJsonLayer":
        return new GeoJsonLayer(item);
      case "HexagonLayer":
        return new HexagonLayer(item);
      case "ColumnLayer":
        return new ColumnLayer(item);
      case "TextLayer":
        return new TextLayer(item);
      case "ScreenGridLayer":
        return new ScreenGridLayer(item);
      case "ScatterplotLayer":
        return new ScatterplotLayer(item);
      case "TileLayer":
        return new TileLayer(item);
      case "MVTLayer":
        return new MVTLayer(item);
      case "Tile3DLayer":
        return new Tile3DLayer(item);
      case "TerrainLayer":
        return new TerrainLayer(item);
    }
  });

  const onClick = (info, event) => {
    info.x === -1 ? null : setFeature(info);
    event.preventDefault();
    // console.log(info);
  };

  return (
    <>
      {/* 右クリックによるメニュー抑止 */}
      <div onContextMenu={(e) => e.preventDefault()}>
        <DeckGL
          layers={[backgroundLayer, layersWithSetting]}
          controller={{
            inertia: true,
            scrollZoom: { speed: 0.05, smooth: true },
            touchRotate: true,
          }}
          onClick={onClick}
          viewState={viewState}
          onViewStateChange={({ viewState }) => {
            setViewState(viewState);
          }}
        ></DeckGL>
      </div>
    </>
  );
};

export default React.memo(Map);
