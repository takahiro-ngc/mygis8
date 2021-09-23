import { useState } from "react";
import Map from "../components/map/Map";
import BottomInfo from "../components/menu/BottomInfo";
import FeatureInfo from "../components/FeatureInfo";
import { findLayer } from "../components/layer/layerList";
import NewMenu from "../components/menu/NewMenu";
import { Button } from "@mui/material";
import { Drawer } from "@mui/material";

const defaultLayerId = "disaster_lore_all";
// const defaultLayerId = "OpenStreetMap";
const defaultLayer = findLayer(defaultLayerId);

export default function MainContent({
  layers,
  setLayers,
  viewState,
  setViewState,
  isDoubleView,
  isMainView,
  variant,
  setFeature,
}) {
  const [loadedData, setLoadedData] = useState({});
  const [isMenuVisible, setIsMenuVisible] = useState(true);
  return (
    <div
      key={variant}
      style={{
        display: "flex",
        height: "100%", //子要素に継承させるため必須
        width: isDoubleView ? "50%" : "100%",
      }}
    >
      <NewMenu
        layers={layers}
        setLayers={setLayers}
        setViewState={setViewState}
        isMainView={isMainView}
        isDoubleView={isDoubleView}
        loadedData={loadedData}
        isMenuVisible={isMenuVisible}
        setIsMenuVisible={setIsMenuVisible}
      />

      <Map
        layers={layers}
        setLayers={setLayers}
        viewState={viewState}
        setViewState={setViewState}
        setFeature={setFeature}
        setLoadedData={setLoadedData}
        isMenuVisible={isMenuVisible}
      />

      <BottomInfo viewState={viewState} />
    </div>
  );
}
