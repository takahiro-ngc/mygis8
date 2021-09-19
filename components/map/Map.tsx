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
  isMenuVisible,
}) => {
  const cloneLayers = [...layers]; //reverseは破壊的メソッドのため注意
  const reversedLayers = cloneLayers.reverse();
  // const testLayer = reversedLayers.map((d) => addDefaultProps(d));
  const testLayer3 = reversedLayers.map((d) => ({
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
    setFeature(info);
    console.log(info);
  };

  // const gsilayer = new TileLayer({
  //   id: "skhb01",
  //   data: "https://maps.gsi.go.jp/xyz/skhb01/{z}/{x}/{y}.geojson",
  //   minZoom: 10,
  //   maxZoom: 10,
  //   tileSize: 256,
  //   pointType: "circle",
  //   // pointType: "icon", // "circle+icon",
  //   getIcon: (d) => {
  //     const src = d.properties;
  //     return {
  //       url: "https://maps.gsi.go.jp/portal/sys/v4/symbols/skhb.png",
  //       width: src?._iconSize?.[0] ?? 20,
  //       height: src?._iconSize?.[1] ?? 20,
  //       anchorX: src?._iconAnchor?.[0] ?? 10,
  //       anchorY: src?._iconAnchor?.[1] ?? 10,
  //     };
  //   },

  //   // highlightedObjectIndex: 10,
  //   getIconSize: 24, //必須
  //   getPointRadius: (d) => 1000,
  //   pickable: true,
  //   autoHighlight: true,
  //   highlightColor: [255, 0, 0, 128],
  //   // filled: true,
  // });

  return (
    <DeckGL
      // layers={[backgroundLayer, gsilayer]}
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
  );
};

export default React.memo(Map);
