import DeckGL from "deck.gl";
import React from "react";

import { makeLayerInstance } from "../components/utils/utility";
import { useLayers } from "../hooks/useLayers";
import useViewState from "../hooks/useViewState";

export const Map = ({ setClickedFeature }) => {
  const viewState = useViewState((state) => state);
  const setViewState = useViewState((state) => state.setViewState);
  const onViewStateChange = ({ viewState }) => setViewState(viewState);

  const layers = useLayers((state) => state.layers);
  const reversedLayer = [...layers].reverse(); //reverseは破壊的メソッドのため注意
  const layerInstance = reversedLayer.map((item) => makeLayerInstance(item));
  const changeLayerProps = useLayers((state) => state.changeLayerProps);
  const onClick = (info, e) => {
    setClickedFeature(info);

    // changeLayerProps(0, { selectedFeatureIndexes: [info.index] });
    console.log(info);
    console.log(layers);
    e.preventDefault();
  };

  return (
    <div
      key="map"
      onContextMenu={(e) => e.preventDefault()} //右クリックメニューの抑止
    >
      <DeckGL
        controller={{
          doubleClickZoom: false,
        }}
        layers={layerInstance}
        // controller={{
        //   inertia: true,
        //   scrollZoom: { speed: 0.05, smooth: true },
        //   touchRotate: true,
        // }}
        onClick={onClick}
        viewState={viewState}
        onViewStateChange={onViewStateChange}
      ></DeckGL>
    </div>
  );
};

export default React.memo(Map);
