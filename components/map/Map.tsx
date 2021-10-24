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
  // const testLayer = reversedLayers.map((d) => addDefaultProps(d));
  const testLayer3 = reversedLayers.map((d) => ({
    ...d,
    // onDataLoad: (value) => {
    //   console.log("ondataload", value);
    //   setLoadedData((prev) => ({ ...prev, [d.id]: value?.features }));
    // },
    // onViewportLoad: (data) => {
    //   const features = data.flatMap((d) => d?.content?.features || []);
    //   setLoadedData((prev) => ({ ...prev, [d.id]: features }));
    //   console.log("onViewportLoad", data);
    // },
    // dataTransform: (d) => {
    //   console.log("dataTransform", d);
    //   return d;
    // },

    // pickable: true,
    // _subLayerProps: {
    //   "points-icon": {
    //     pickable: true,
    //     autoHighlight: true,
    //     highlightColor: [255, 0, 0, 128],
    //     // highlightedObjectIndex: 2,
    //   },
    //   "points-circle": {
    //     pickable: true,
    //     highlightColor: [255, 0, 0, 128],
    //     // highlightedObjectIndex: 2,

    //     autoHighlight: true,
    //   },
    // },
  }));

  const testLayer2 = testLayer3.map((d) =>
    d.target ? { ...d, getFillColor: d.target } : d
  );
  const data = {
    GeoJsonLayer,
    TileLayer,
    HexagonLayer,
    TerrainLayer,
    MVTLayer,
    ColumnLayer,
  };
  const layersWithSetting = testLayer2.map(
    (item) => new data[item.layerType](item)
  );

  const onClick = (info, event) => {
    setFeature(info);
    event.preventDefault();
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
  const preventContextMenu = (e) => e.preventDefault();
  const handleViewState = ({ viewState }) => setViewState(viewState);
  return (
    <div
      key="map"
      onContextMenu={preventContextMenu} //右クリックメニューの抑止
    >
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
        onViewStateChange={handleViewState}
      ></DeckGL>
    </div>
  );
};

export default React.memo(Map);
