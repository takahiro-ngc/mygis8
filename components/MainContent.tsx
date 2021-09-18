import { useState } from "react";
import Map from "../components/map/Map";
import BottomInfo from "../components/menu/BottomInfo";
import Menu from "../components/menu/Menu";
import Header from "../components/header/Header";
import FeatureInfo from "../components/FeatureInfo";
import { findLayer } from "../components/layer/layerList";
import SyncSwitch from "../components/SyncSwitch";
import NewMenu from "../components/menu/NewMenu";

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
  //   key,
}) {
  const [loadedData, setLoadedData] = useState({});
  const [feature, setFeature] = useState(null);

  return (
    <div className="side" key={isMainView.toString()}>
      <NewMenu
        layers={layers}
        setLayers={setLayers}
        setViewState={setViewState}
        isMainView={isMainView}
        isDoubleView={isDoubleView}
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
      <style jsx>
        {`
          .side {
            position: relative;
            display: flex;
            width: 100%;
            height: 100%; //子要素に継承させるため必須
          }
        `}
      </style>
    </div>
  );
}
