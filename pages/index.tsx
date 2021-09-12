import { useState } from "react";
import Map from "../components/map/Map";
import BottomInfo from "../components/menu/BottomInfo";
import Menu from "../components/menu/Menu";
import Header from "../components/header/Header";
import FeatureInfo from "../components/FeatureInfo";
import { findLayer } from "../components/layer/layerList";
import SyncSwitch from "../components/SyncSwitch";

export const initialViewState = {
  longitude: 139.7673068,
  latitude: 35.6809591,
  bearing: 0,
  zoom: 8,
  minZoom: 0, //遠景
  maxZoom: 17.499, //近景 地理院地図（ラスター）は17.5未満が最大
  maxPitch: 85,
};

const defaultLayerId = "disaster_lore_all";
// const defaultLayerId = "OpenStreetMap";
const defaultLayer = findLayer(defaultLayerId);

export default function Home() {
  // メインマップ用
  const [layers, setLayers] = useState([defaultLayer]);
  const [viewState, setViewState] = useState(initialViewState);

  // サブマップ用
  const [layersForSub, setLayersForSub] = useState([defaultLayer]);
  const [viewStateForSub, setViewStateForSub] = useState(initialViewState);

  // メイン・サブ共通
  const [feature, setFeature] = useState(null);
  const [isDoubleView, setIsDoubleView] = useState(false);
  const [isSync, setIsSync] = useState(false);
  const [loadedData, setLoadedData] = useState({});

  return (
    <div className="wrapper">
      <Header setLayers={setLayers} setIsDoubleView={setIsDoubleView} />
      <div className="main">
        <div className="side">
          <Map
            layers={layers}
            setLayers={setLayers}
            viewState={viewState}
            setViewState={setViewState}
            setFeature={setFeature}
            setLoadedData={setLoadedData}
          />
          <Menu //後の要素が上に描画される
            layers={layers}
            setLayers={setLayers}
            setViewState={setViewState}
            isMainView={true}
            isDoubleView={isDoubleView}
            loadedData={loadedData}
          />
        </div>

        {isDoubleView && (
          <div className="side" style={{ borderLeft: "1px black solid" }}>
            <Map
              layers={layersForSub}
              setLayers={setLayersForSub}
              viewState={isSync ? viewState : viewStateForSub}
              setViewState={isSync ? setViewState : setViewStateForSub}
              setFeature={setFeature}
              setLoadedData={setLoadedData}
            />
            <Menu
              layers={layersForSub}
              setLayers={setLayersForSub}
              setViewState={setViewStateForSub}
              isMainView={false}
              isDoubleView={isDoubleView}
              loadedData={loadedData}
            />
            <SyncSwitch
              isSync={isSync}
              setIsSync={setIsSync}
              viewState={viewState}
              setViewStateForSub={setViewStateForSub}
            />
          </div>
        )}

        <FeatureInfo feature={feature} setFeature={setFeature} />
        <BottomInfo viewState={viewState} />
      </div>

      <style jsx>
        {`
          .wrapper {
            display: flex;
            flex-direction: column;
            width: 100vw;
            height: 100vh;
          }
          .main {
            width: 100%;
            height: 100%;
            overflow: hidden; //カクつくことがあるのを防ぐ
            display: flex;
            position: relative;
          }
          .side {
            position: relative;
            height: 100%; //子要素に継承させるため必須
            flex-grow: 1;
          }
        `}
      </style>
    </div>
  );
}
