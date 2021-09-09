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
import { EditableGeoJsonLayer } from "@nebula.gl/layers";
import { Button } from "@material-ui/core";
import { backgroundLayer } from "./backgroundLayer";
import { addDefaultProps } from "./addDefaultProps";

export const Map = ({
  layers,
  viewState,
  setViewState,
  feature,
  setFeature,
}) => {
  // リストで上のレイヤーを上層に描画させる
  // const prepareRender
  const cloneLayers = [...layers]; //reverseは破壊的メソッドのため注意
  const reversedLayers = cloneLayers.reverse();
  const testLayer = reversedLayers.map((d) => addDefaultProps(d));
  const layersWithSetting = testLayer.map((item: any, index: number) => {
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
          onHover={onClick}
          onClick={onClick}
          viewState={viewState}
          onViewStateChange={({ viewState }) => {
            // autoElevationData(viewState.zoom);
            setViewState(viewState);
          }}
        ></DeckGL>
      </div>
    </>
  );
};

export default React.memo(Map);
