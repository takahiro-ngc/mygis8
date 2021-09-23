import { useState } from "react";

import Header from "../components/header/Header";
import { findLayer } from "../components/layer/layerList";
import SyncSwitch from "../components/SyncSwitch";
import MainContent from "../components/MainContent";
import FeatureInfo from "../components/FeatureInfo";

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
  const [layersForSub, setLayersForSub] = useState(defaultLayer);

  const [viewState, setViewState] = useState(initialViewState);
  const [viewStateForSub, setViewStateForSub] = useState(initialViewState);

  const [isDoubleView, setIsDoubleView] = useState(false);
  const [isSync, setIsSync] = useState(false);
  const [feature, setFeature] = useState(null);

  return (
    <div className="wrapper">
      <Header setLayers={setLayers} setIsDoubleView={setIsDoubleView} />
      <div className="main">
        <MainContent
          variant="mainView"
          layers={layers}
          setLayers={setLayers}
          viewState={viewState}
          setViewState={setViewState}
          isDoubleView={isDoubleView}
          isMainView={true}
          setFeature={setFeature}
        />
        {isDoubleView && (
          <>
            <MainContent
              variant="subView"
              layers={layersForSub}
              setLayers={setLayersForSub}
              viewState={isSync ? viewState : viewStateForSub}
              setViewState={isSync ? setViewState : setViewStateForSub}
              isDoubleView={isDoubleView}
              isMainView={false}
              setFeature={setFeature}
            />
            <SyncSwitch
              isSync={isSync}
              setIsSync={setIsSync}
              viewState={viewState}
              setViewStateForSub={setViewStateForSub}
            />
          </>
        )}
      </div>
      <FeatureInfo feature={feature} setFeature={setFeature} />

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
        `}
      </style>
    </div>
  );
}
