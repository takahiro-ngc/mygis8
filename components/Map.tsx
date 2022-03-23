import DeckGL from "deck.gl";
import React from "react";

import { createLayerInstance } from "../components/utils/utility";
import useClickedFeature from "../hooks/useFeature";
import useFeature from "../hooks/useFeature";
import { useLayers } from "../hooks/useLayers";
import useViewState from "../hooks/useViewState";

export const Map = ({ setClickedFeature }) => {
  const viewState = useViewState();
  const { setViewState } = useViewState();
  const onViewStateChange = ({ viewState }) => setViewState(viewState);

  const { layers, loadedFeature } = useLayers();
  const reversedLayer = [...layers].reverse();
  const layerInstance = reversedLayer.map((item) => createLayerInstance(item));

  const onClick = (info, e) => {
    setClickedFeature(info);

    console.log(info);
    console.log(layers);
    console.log(loadedFeature);
    e.preventDefault();
  };

  return (
    <div
      key="map"
      onContextMenu={(e) => e.preventDefault()} //右クリックメニューの抑止
    >
      <DeckGL
        layers={layerInstance}
        getCursor={({ isDragging, isHovering }) =>
          isDragging ? "grabbing" : isHovering ? "pointer" : "grab"
        }
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
