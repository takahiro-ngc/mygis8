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
export const defaultLayer = findLayer(defaultLayerId);

export default function Home() {
  // メインマップ用
  const [layers, setLayers] = useState([defaultLayer]);
  const [viewState, setViewState] = useState(initialViewState);

  // サブマップ用
  const [layersForSub, setLayersForSub] = useState([defaultLayer]);
  const [viewStateForSub, setViewStateForSub] = useState(initialViewState);

  // 共通
  const [feature, setFeature] = useState(null);
  const [isDoubleView, setIsDoubleView] = useState(true);

  return (
    <div className="wrapper">
      <Header setLayers={setLayers} setIsDoubleView={setIsDoubleView} />
      <div className="main">
        <div className="side">
          <MainMap
            layers={layers}
            viewState={viewState}
            setViewState={setViewState}
            setFeature={setFeature}
          />
          {/* 後要素が上に描画される */}
          <MainMenu
            layers={layers}
            setLayers={setLayers}
            setViewState={setViewState}
            isMainView={true}
            isDoubleView={isDoubleView}
          />
        </div>

        <div
          className="side"
          style={{ borderLeft: "1px black solid" }}
          hidden={!isDoubleView}
        >
          <MainMap
            layers={layersForSub}
            viewState={viewStateForSub}
            setViewState={setViewStateForSub}
            setFeature={setFeature}
          />
          <MainMenu
            layers={layersForSub}
            setLayers={setLayersForSub}
            setViewState={setViewStateForSub}
            isMainView={false}
            isDoubleView={isDoubleView}
          />
        </div>
      </div>

      <FeatureInfo feature={feature} setFeature={setFeature} />
      <BottomInfo viewState={viewState} />

      <style jsx>
        {`
          .wrapper {
            display: flex;
            flex-direction: column;
            width: 100vw;
            height: 100vh;
            border: 10px red solid;
          }
          .main {
            width: 100%;
            height: 100%;
            overflow: hidden; //カクつくことがあるのを防ぐ
            display: flex;
          }
          .side {
            position: relative;
            height: 100%; //子要素に継承させるため必須
            width: 100%; //仮
            flex-grow: 1;
            overflow: hidden; //仮
          }
        `}
      </style>
    </div>
  );
}
