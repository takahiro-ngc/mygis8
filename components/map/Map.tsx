import { HexagonLayer } from "@deck.gl/aggregation-layers";
import { MVTLayer, TerrainLayer, TileLayer } from "@deck.gl/geo-layers";
import { ColumnLayer, GeoJsonLayer } from "@deck.gl/layers";
import DeckGL from "deck.gl";
import { addDefaultProps } from "./addDefaultProps";
import React from "react";

export const Map = ({
  layers,
  viewState,
  setViewState,
  setClickedFeature,
  storeLoadedData,
}) => {
  const cloneLayers = [...layers];
  // const testLayer = reversedLayers.map((d) => addDefaultProps(d));
  const testLayer = cloneLayers.map((d, index) => ({
    // importFileのために必要
    ...addDefaultProps(d),
    ...d,
    onDataLoad: (value) => storeLoadedData({ [d.id]: value?.features }),
    onViewportLoad: (data) => {
      const features = data.flatMap((d) => d?.content?.features || []);
      storeLoadedData({ [d.id]: features });
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
    setClickedFeature(info);
    console.log(info);
    e.preventDefault();
  };

  const onViewStateChange = ({ viewState }) => setViewState(viewState);

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
        onViewStateChange={onViewStateChange}
      ></DeckGL>
    </div>
  );
};

export default React.memo(Map);
