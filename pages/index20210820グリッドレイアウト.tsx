import { useState } from "react";
import MenuContainer from "../components/menu/MenuContainer ";
import { Map } from "../components/map/Map";
import BottomBar from "../components/menu/BottomInfo";
import LeftBar from "../components/menu/MainMenu";
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

  return (
    <>
      <div className="wrapper">
        <div className="header">
          <Header />
        </div>

        <div className="left">
          <LeftBar
            layers={layers}
            setLayers={setLayers}
            setViewState={setViewState}
          />
        </div>

        <div className="right">
          <div className="popup">
            <FeatureInfo feature={feature} setFeature={setFeature} />
          </div>
        </div>
        <div className="bottom">
          <BottomBar viewState={viewState} />
        </div>
      </div>
      <MainMap
        layers={layers}
        viewState={viewState}
        setViewState={setViewState}
        setFeature={setFeature}
      />
      <style jsx>
        {`
          div {
            z-index: 1;
          }
          .wrapper {
            display: grid;
            grid-template-rows: auto auto 1fr;
            grid-template-columns: minmax(300px, 400px) minmax(0px, 100%);
            height: 100vh;
            width: 100vw;
          }

          .header {
            grid-row: 1;
            grid-column: 1 / 3;
          }
          .left {
            grid-row: 2 / 4;
            grid-column: 1;
            border: red 10px solid !important;
          }

          .right {
            grid-row: 2 / 3;
            grid-column: 2;
            position: relative;
            height: 100%;
            width: 0px;
            border: red 5px solid;
            margin-left: auto;
          }
          .bottom {
            grid-row: 3 / 4;
            grid-column: 2;
            border: green 10px solid;
            margin-top: auto;
          }
          .popup {
            position: absolute;
            right: 0;
            max-height: 100%;
            border: blue 5px solid;
            overflow: auto;
          }
        `}
      </style>
    </>
  );
}
