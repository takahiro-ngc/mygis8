import { Stack } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useState, useRef } from "react";
import BottomInfo from "../components/BottomInfo";
import FeatureInfo from "../components/FeatureInfo";
import Header from "../components/header/Header";
import Map from "../components/Map";
import Menu from "../components/menu/Menu";
import { useLoadedFeatures } from "../hooks/useLoadedFeatures";
import { useLayers } from "../hooks/useLayers";
import { useCallback } from "react";
import React from "react";

export const initialViewState = {
  longitude: 139.7673068,
  latitude: 35.6809591,
  bearing: 0,
  zoom: 8,
  minZoom: 0, //遠景
  maxZoom: 17.499, //近景 地理院地図（ラスター）は17.5未満が最大
  maxPitch: 85,
};

const defaultLayerId1 = "pale";
const defaultLayerId2 = "OpenStreetMap";
const defaultLayers = [defaultLayerId1, defaultLayerId2];

const Home = () => {
  const [viewState, setViewState] = useState(initialViewState);
  const [clickedFeature, setClickedFeature] = useState(null);
  const [layers, storedData, { toggleLayer, setLayers }] =
    useLayers(defaultLayers);
  const handleLayer = { toggleLayer, setLayers };
  // const [layers, storedData, handleLayer] = useLayers(defaultLayers);
  // const [layers, storedData, handleLayerOriginal] = useLayers(defaultLayers);
  // const handleLayer = useCallback(handleLayerOriginal, [layers]);

  const isMediaQuery = useMediaQuery("(max-width:600px)");

  return (
    <Stack sx={{ height: "100vh", width: "100vw", overflow: "hidden" }}>
      <Header handleLayer={handleLayer} />
      {/* <span onClick={() => handleLayer.toggleLayer("pale")}>aaaaa</span> */}
      <div style={{ height: "100%", position: "relative" }}>
        <Menu
          handleLayer={handleLayer}
          layers={layers}
          setViewState={setViewState}
          storedData={storedData}
          isMediaQuery={isMediaQuery}
        />
        <Map
          viewState={viewState}
          setViewState={setViewState}
          setClickedFeature={setClickedFeature}
          layers={layers}
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
