import { useState } from "react";

import Header from "../components/header/Header";
import { findLayer } from "../components/layer/layerList";

import FeatureInfo from "../components/FeatureInfo";
import Menu from "../components/menu/Menu";
import Map from "../components/map/Map";
import BottomInfo from "../components/menu/BottomInfo";
import { Stack } from "@mui/material";

export const initialViewState = {
  longitude: 139.7673068,
  latitude: 35.6809591,
  bearing: 0,
  zoom: 8,
  minZoom: 0, //遠景
  maxZoom: 17.499, //近景 地理院地図（ラスター）は17.5未満が最大
  maxPitch: 85,
};

const defaultLayerId1 = "disaster_lore_all";
const defaultLayerId2 = "OpenStreetMap";
const defaultLayer1 = findLayer(defaultLayerId1);
const defaultLayer2 = findLayer(defaultLayerId2);
const defaultLayer = [defaultLayer1, defaultLayer2];

export default function Home() {
  const [layers, setLayers] = useState(defaultLayer);
  const [viewState, setViewState] = useState(initialViewState);
  const [feature, setFeature] = useState(null);
  const [loadedData, setLoadedData] = useState({});

  return (
    <Stack sx={{ height: "100vh", width: "100vw" }}>
      <Header setLayers={setLayers} />
      <div style={{ height: "100%", position: "relative" }}>
        <Menu
          layers={layers}
          setLayers={setLayers}
          setViewState={setViewState}
          loadedData={loadedData}
        />
        <Map
          layers={layers}
          setLayers={setLayers}
          viewState={viewState}
          setViewState={setViewState}
          setFeature={setFeature}
          setLoadedData={setLoadedData}
        />
        <FeatureInfo feature={feature} setFeature={setFeature} />
        <BottomInfo viewState={viewState} />
      </div>
    </Stack>
  );
}
