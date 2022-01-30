import { Stack } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useState } from "react";
import BottomInfo from "../components/BottomInfo";
import FeatureInfo from "../components/FeatureInfo";
import Header from "../components/header/Header";
import { findLayer } from "../components/layer/layerList";
import Map from "../components/map/Map";
import Menu from "../components/Menu";
import { useLoadedFeatures } from "../hooks/useLoadedFeatures";

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
// const defaultLayerId1 = "disaster_lore_all";
const defaultLayerId2 = "OpenStreetMap";
const defaultLayer1 = findLayer(defaultLayerId1);
const defaultLayer2 = findLayer(defaultLayerId2);
const defaultLayer = [defaultLayer1, defaultLayer2];

export default function Home() {
  const [layers, setLayers] = useState(defaultLayer);
  const [viewState, setViewState] = useState(initialViewState);
  const [clickedFeature, setClickedFeature] = useState(null);
  const [loadedData, storeLoadedData] = useLoadedFeatures();

  const isMediaQuery = useMediaQuery("(max-width:600px)");

  return (
    <Stack sx={{ height: "100vh", width: "100vw", overflow: "hidden" }}>
      <Header setLayers={setLayers} />
      <div style={{ height: "100%", position: "relative" }}>
        <Menu
          layers={layers}
          setLayers={setLayers}
          setViewState={setViewState}
          loadedData={loadedData}
          isMediaQuery={isMediaQuery}
        />
        <Map
          layers={layers}
          viewState={viewState}
          setViewState={setViewState}
          setClickedFeature={setClickedFeature}
          storeLoadedData={storeLoadedData}
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
}
