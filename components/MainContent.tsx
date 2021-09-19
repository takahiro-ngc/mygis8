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
  const [isMenuVisible, setIsMenuVisible] = useState(true);

  return (
    <div className="side" key={isMainView.toString()}>
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
      {/* 右クリックメニューの抑止 */}
      <div
        onContextMenu={(e) => e.preventDefault()}
        style={{
          position: "relative",
          border: "3px red solid",
          width: "100%",
          flexGrow: 1,

          transitionProperty: "all",
          transitionDuration: "195ms",
          transitionTimingFunction: "ease-in-out",
          //   transition: "all .2s ease-in-out",
          ...(!isMenuVisible && {
            marginLeft: `-${300}px`,
            transitionDuration: "225ms",
          }),
          //   ...(isMenuVisible && {
          //     transition: "all",
          //     easing: "cubic-bezier(0.0, 0, 0.2, 1)",
          //     duration: 225,
          //     marginLeft: 0,
          //   }),
        }}
      >
        <Map
          layers={layers}
          setLayers={setLayers}
          viewState={viewState}
          setViewState={setViewState}
          setFeature={setFeature}
          setLoadedData={setLoadedData}
          isMenuVisible={isMenuVisible}
        />
      </div>
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
