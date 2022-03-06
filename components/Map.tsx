import DeckGL from "deck.gl";
import React from "react";
import { createLayerInstance } from "../components/utils/utility";
import { useViewState } from "../hooks/useLayers";
import { useLayers } from "../hooks/useLayers";

export const Map = ({ setClickedFeature, deck }) => {
  const viewState = useViewState((state) => state);
  const setViewState = useViewState((state) => state.setViewState);
  const onViewStateChange = ({ viewState }) => setViewState(viewState);

  const layers = useLayers((state) => state.layers);
  const reversedLayer = [...layers].reverse(); //reverseは破壊的メソッドのため注意
  const layerInstance = reversedLayer.map((item) => createLayerInstance(item));

  const onClick = (info, e) => {
    setClickedFeature(info);
    console.log(info);
    e.preventDefault();
  };

  return (
    <div
      key="map"
      onContextMenu={(e) => e.preventDefault()} //右クリックメニューの抑止
    >
      <DeckGL
        ref={deck}
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
