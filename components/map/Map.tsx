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
// import { Toolbox } from "@nebula.gl/editor";
import { addDefaultProps } from "./addDefaultProps";

export const Map = ({
  layers,
  viewState,
  setViewState,
  feature,
  setFeature,
  modeOfEdit,
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
    setFeature(info);
    event.preventDefault();
    console.log(info);
  };

  const [features, setFeatures] = useState({
    type: "FeatureCollection",
    features: [],
  });

  const EditableGeoJson = new EditableGeoJsonLayer({
    id: "EditableGeoJson",
    data: features,
    mode: modeOfEdit?.handler,
    // ToDo id==="EditableGeoJson"の時のみ
    selectedFeatureIndexes: [feature?.index],
    onEdit: ({ updatedData }) => {
      setFeatures(updatedData);
      console.log(feature);
    },
    pickable: true,
    autoHighlight: true,
  });

  return (
    <>
      {/* 右クリックによるメニュー抑止 */}
      <div onContextMenu={(e) => e.preventDefault()}>
        <DeckGL
          layers={[backgroundLayer, layersWithSetting, EditableGeoJson]}
          controller={{
            inertia: true,
            scrollZoom: { speed: 0.05, smooth: true },
            touchRotate: true,
            doubleClickZoom: modeOfEdit?.id === "ViewMode" ? true : false,
          }}
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
