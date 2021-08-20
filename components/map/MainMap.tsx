import { useState } from "react";
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
// import { GsiTerrainLayer } from "deckgl-gsi-terrain-layer";
// import { TerrainLayer } from "../terrainLayerForGSI/deckgl/geo-layers/src/";
// import { LabeledGeoJsonLayer } from "../components/customLayer";
import { GsiTerrainLayer } from "../terrainLayerForGSI/deckgl-gsi-terrain-layer/index.js";

export default function MainMap({
  layers,
  viewState,
  setViewState,
  setFeature,
}) {
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
      // case "LabeledGeoJsonLayer":
      //   return new LabeledGeoJsonLayer(setting);
      // // https://github.com/Kanahiro/deckgl-gsi-terrain-layer
      case "GsiTerrainLayer":
        return new GsiTerrainLayer({
          ...setting,
          // elevationData: elevationData,
          // maxZoom: 15.99,
        });
      case "MVTLayer":
        return new MVTLayer(setting);
      case "Tile3DLayer":
        return new Tile3DLayer(setting);
      case "TerrainLayer":
        return new TerrainLayer(setting);
    }
  });

  const onClick = (info) => {
    setFeature(info);
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

  return (
    <>
      {/* 右クリックによるメニュー抑止 */}
      <div onContextMenu={(e) => e.preventDefault()}>
        <DeckGL
          layers={[backgroundLayer, layersWithSetting]}
          controller={{
            inertia: true,
            scrollZoom: { speed: 0.01, smooth: true },
            touchRotate: true,
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
}
