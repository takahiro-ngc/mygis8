import DeckGL from "deck.gl";
import React, { useRef } from "react";
import { createLayerInstance } from "../components/utils/utility";

export const Map = ({ viewState, setViewState, setClickedFeature, layers }) => {
  const reversedLayer = [...layers].reverse(); //reverseは破壊的メソッドのため注意
  const layerInstance = reversedLayer.map((item) => createLayerInstance(item));

  const onClick = (info, e) => {
    setClickedFeature(info);
    console.log(info);
    e.preventDefault();
  };
  const onViewStateChange = ({ viewState }) => setViewState(viewState);

  return (
    <div
      key="map"
      onContextMenu={(e) => e.preventDefault()} //右クリックメニューの抑止
    >
      <DeckGL
        layers={layerInstance}
        controller={{
          inertia: true,
          scrollZoom: { speed: 0.05, smooth: true },
          touchRotate: true,
        }}
        onClick={onClick}
        viewState={viewState}
        onViewStateChange={onViewStateChange}
      ></DeckGL>
    </div>
  );
};

export default React.memo(Map);
