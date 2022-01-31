import DeckGL from "deck.gl";
import React from "react";

export const Map = ({
  layerInstance,
  viewState,
  setViewState,
  setClickedFeature,
  storeLoadedData,
  // setHoverdFeature,
}) => {
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
        // onClick={() =>
        //   // console.log(layerInstance[0].state?.tileset._tiles[0].bbox)
        // }
        onClick={() => console.log(layerInstance)}
        // onClick={onClick}
        // onHover={(info) => setHoverdFeature(info)}
        viewState={viewState}
        onViewStateChange={onViewStateChange}
      ></DeckGL>
    </div>
  );
};

export default React.memo(Map);
