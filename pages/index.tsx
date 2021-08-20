import { useState } from "react";
import MainMap from "../components/map/MainMap";
import BottomInfo from "../components/menu/BottomInfo";
import MainMenu from "../components/menu/MainMenu";
import Header from "../components/header/Header";
import FeatureInfo from "../components/FeatureInfo";
import { findLayer } from "../components/layer/layerList";

export const initialViewState = {
  longitude: 139.7673068,
  latitude: 35.6809591,
  bearing: 0,
  zoom: 10,
  minZoom: 0, //遠景
  maxZoom: 17.499, //近景 地理院地図（ラスター）は17.5未満が最大
  maxPitch: 85,
};

const defaultLayerId = "pale";
const defaultLayer = findLayer(defaultLayerId);

export default function Home() {
  const [layers, setLayers] = useState([defaultLayer]);
  const [viewState, setViewState] = useState(initialViewState);
  const [feature, setFeature] = useState(null);
  console.log("vygbuhn");
  return (
    <>
      <div className="flex">
        <Header />

        <MainMenu
          layers={layers}
          setLayers={setLayers}
          setViewState={setViewState}
        />
      </div>
      <FeatureInfo feature={feature} setFeature={setFeature} />
      <BottomInfo viewState={viewState} />
      <MainMap
        layers={layers}
        viewState={viewState}
        setViewState={setViewState}
        setFeature={setFeature}
      />
      <script> </script>
      <style jsx>
        {`
          .flex {
            display: flex;
            flex-direction: column;
          }
        `}
      </style>
    </>
  );
}
