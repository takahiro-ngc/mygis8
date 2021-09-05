import React, { useState, useCallback } from "react";
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
import {
  ViewMode,
  DrawPointMode,
  DrawLineStringMode,
  DrawPolygonMode,
  DrawPolygonByDraggingMode,
  DrawRectangleUsingThreePointsMode,
  DrawCircleFromCenterMode,
} from "nebula.gl";

export const Map = ({
  layers,
  viewState,
  setViewState,
  setFeature,
  modeOfEdit,
}) => {
  // https://gbank.gsj.jp/seamless/elev/tile.html
  const SEEMLESS = "https://tiles.gsj.jp/tiles/elev/mixed/{z}/{y}/{x}.png";
  // https://maps.gsi.go.jp/development/hyokochi.html
  const DEM5A =
    "https://cyberjapandata.gsi.go.jp/xyz/dem5a_png/{z}/{x}/{y}.png";
  const DEM10B = "https://cyberjapandata.gsi.go.jp/xyz/dem_png/{z}/{x}/{y}.png";
  const DEMGM =
    "https://cyberjapandata.gsi.go.jp/xyz/demgm_png/{z}/{x}/{y}.png";
  const [elevationData, setElevationData] = useState(DEM10B);
  const autoElevationData = (zoom: number) =>
    setElevationData(
      "https://tiles.gsj.jp/tiles/elev/gsidem5a/{z}/{y}/{x}.png"
    );
  // setElevationData(zoom >= 13.5 ? DEM5A : zoom >= 7.5 ? DEM10B : DEMGM);

  // リストで上のレイヤーを上層に描画させる
  const cloneLayers = [...layers]; //reverseは破壊的メソッドのため注意
  const reversedLayers = cloneLayers.reverse();

  const layersWithSetting = reversedLayers.map((item: any, index: number) => {
    const setting = {
      ...item,
      updateTriggers: {
        getFillColor: layers[index]?.getFillColor,
        // all: layers[index].layerType,
      },
      // onDataLoad: (value) => console.log(value),
    };

    switch (item.layerType) {
      case "GeoJsonLayer":
        return new GeoJsonLayer(setting);
      case "HexagonLayer":
        return new HexagonLayer(setting);
      case "ColumnLayer":
        return new ColumnLayer(setting);
      case "TextLayer":
        return new TextLayer(setting);
      case "ScreenGridLayer":
        return new ScreenGridLayer(setting);
      case "ScatterplotLayer":
        return new ScatterplotLayer(setting);
      case "TileLayer":
        return new TileLayer(setting);
      // case "GsiTerrainLayer":
      //   return new GsiTerrainLayer({
      //     ...setting,
      //     // elevationData: elevationData,
      //     // maxZoom: 15.99,
      //   });
      case "MVTLayer":
        return new MVTLayer(setting);
      case "Tile3DLayer":
        return new Tile3DLayer(setting);
      case "TerrainLayer":
        return new TerrainLayer(setting);
    }
  });

  const onClick = (info, event) => {
    setFeature(info);
    event.preventDefault();
    console.log(info);
  };

  // ToDo 背景レイヤーがないときは，合成できないようにすれば？
  // 背景レイヤーがないと，「合成」したときに見えなくなるのを防止
  const backgroundLayer = new BitmapLayer({
    id: "background-layer",
    bounds: [-180, -180, 180, 180],
    image: "/img/white.jpg",
    // 傾けたときにチラつくのを防止
    parameters: {
      depthTest: false,
    },
  });

  const [features, setFeatures] = useState({
    type: "FeatureCollection",
    features: [],
  });
  const [selectedFeatureIndexes] = useState([]);

  const EditableGeoJson = new EditableGeoJsonLayer({
    id: "EditableGeoJson",
    data: features,
    mode: modeOfEdit.handler,
    selectedFeatureIndexes,
    onEdit: ({ updatedData }) => {
      setFeatures(updatedData);
    },
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
            // ToDo
            doubleClickZoom:
              String(modeOfEdit.handler) === "ViewMode" ? true : false,
          }}
          onClick={onClick}
          viewState={viewState}
          onViewStateChange={({ viewState }) => {
            autoElevationData(viewState.zoom);
            setViewState(viewState);
          }}
        ></DeckGL>
      </div>
    </>
  );
};

export default React.memo(Map);
