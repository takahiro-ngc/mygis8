import { Stack } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useState } from "react";
import BottomInfo from "../components/BottomInfo";
import FeatureInfo from "../components/FeatureInfo";
import Header from "../components/header/Header";
import Map from "../components/Map";
import Menu from "../components/menu/Menu";
import { useLoadedFeatures } from "../hooks/useLoadedFeatures";
import { useLayers } from "../hooks/useLayers";
import { useCallback } from "react";
import React from "react";
import { createLayerInstance } from "../components/utils/utility";

export const initialViewState = {
  longitude: 139.7673068,
  latitude: 35.6809591,
  bearing: 0,
  zoom: 8,
  minZoom: 0, //遠景
  maxZoom: 17.499, //近景 地理院地図（ラスター）は17.5未満が最大
  maxPitch: 85,
};

const defaultLayerId1 = "vbmd_colorrel";
const defaultLayerId2 = "OpenStreetMap";
const defaultLayers = [defaultLayerId1, defaultLayerId2];

const Home = () => {
  const [viewState, setViewState] = useState(initialViewState);
  const [clickedFeature, setClickedFeature] = useState(null);
  const [loadedData, storeLoadedData] = useLoadedFeatures();
  const [layers, dispatch] = useLayers(defaultLayers);

  // const importLayers = useCallback(
  //   (layerProps: object) => dispatch({ type: "import", layer: layerProps }),
  //   []
  // );

  const cloneLayers = [...layers];
  const testLayer = cloneLayers.map((d, index) => ({
    ...d,
    onDataLoad: (value) => console.log({ [d.id]: value?.features }),
    onViewportLoad: (data) => {
      const features = data.flatMap((d) => d?.content?.features || []);
      console.log({ [d.id]: features });
    },
  }));
  const testLayer3 = testLayer.reverse(); //reverseは破壊的メソッドのため注意

  const layerInstance = testLayer3.map((item) => createLayerInstance(item));
  const isMediaQuery = useMediaQuery("(max-width:600px)");

  return (
    <Stack sx={{ height: "100vh", width: "100vw", overflow: "hidden" }}>
      <Header dispatch={dispatch} />
      <div style={{ height: "100%", position: "relative" }}>
        <Menu
          dispatch={dispatch}
          layers={layers}
          setViewState={setViewState}
          loadedData={loadedData}
          isMediaQuery={isMediaQuery}
          layerInstance={layerInstance}
        />
        <Map
          viewState={viewState}
          setViewState={setViewState}
          setClickedFeature={setClickedFeature}
          storeLoadedData={storeLoadedData}
          layerInstance={layerInstance}
        />
        <FeatureInfo
          clickedFeature={clickedFeature}
          setClickedFeature={setClickedFeature}
          isMediaQuery={isMediaQuery}
        />
        <BottomInfo viewState={viewState} />
      </div>
    </Stack>
  );
};

export default React.memo(Home);
