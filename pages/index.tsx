import { useState, memo } from "react";
import { Map } from "../components/map/Map";
import BottomInfo from "../components/menu/BottomInfo";
import { MainMenu } from "../components/menu/MainMenu";
import { Header } from "../components/header/Header";
import { FeatureInfo } from "../components/FeatureInfo";
import { findLayer } from "../components/layer/layerList";
import Slide from "@material-ui/core/Slide";

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
          <Map
            layers={layers}
            viewState={viewState}
            setViewState={setViewState}
            setFeature={setFeature}
          />
          <MainMenu //後の要素が上に描画される
            layers={layers}
            setLayers={setLayers}
            setViewState={setViewState}
            isMainView={true}
            isDoubleView={isDoubleView}
          />
        </div>
        {/* <Slide
          in={isDoubleView}
          direction={"left"}
          appear={false} //初期ロード時のtransitionを防ぐ
          unmountOnExit
          mountOnEnter
          // exit={false}
        > */}
        <div
          className="side"
          style={{ borderLeft: "1px black solid" }}
          hidden={!isDoubleView}
        >
          <Map
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
        {/* </Slide> */}
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
            flex-grow: 1;
          }
        `}
      </style>
    </div>
  );
}
