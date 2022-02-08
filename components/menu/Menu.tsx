import React, { useState, useCallback, useReducer, useRef } from "react";
import { Resizable } from "re-resizable";
import { Box } from "@mui/system";
import LayerTree from "./LayerTree";
import SelectedLayer from "./selectedLayer/SelectedLayer";

import ToggleMenuButton from "./ToggleMenuButton";

export const Menu = ({
  layers,
  dispatch,
  setViewState,
  loadedData,
  isMediaQuery,
  layerInstance,
}) => {
  const toggleLayers = useCallback(
    (layerId: string) => dispatch({ type: "toggle", layer: layerId }),
    []
  );
  const setLayers = useCallback(
    (layer) => dispatch({ type: "set", layer: layer }),
    []
  );
  const [isMenuVisible, toggleMenuVisible] = useReducer((prev) => !prev, true);

  return (
    <Box
      sx={{
        transform: `${isMenuVisible || "translate(-100%)"}`,
        transition: "transform 230ms ease-in-out",
        zIndex: 1,
        position: "absolute",
        height: "100%",
        width: "35vw",
        maxWidth: 400,
        minWidth: 300,
        display: "flex",
        flexDirection: "column",
        backgroundColor: "background.default",
        ...(isMediaQuery && {
          transform: `${isMenuVisible || "translate(0, -100%)"}`,
          height: "50%",
          width: "100%",
          maxWidth: "100%",
        }),
      }}
    >
      <ToggleMenuButton
        isMenuVisible={isMenuVisible}
        toggleMenuVisible={toggleMenuVisible}
        isMediaQuery={isMediaQuery}
      />
      {layerInstance[0].state?.features?.pointFeatures[0].__source.object.toString()}
      {JSON.stringify(
        layerInstance[0].state?.features?.pointFeatures[0].__source.object
          .geometry
        //    layerInstance[0].state?.tileset?._selectedTiles[0].content?.features
        // ?.geometry?.type
        // getCircularReplacer()
        // layerInstance[0].state?.tileset?._selectedTiles?.content?.features
      )}
      <LayerTree toggleLayers={toggleLayers} setViewState={setViewState} />
      <Resizable
        defaultSize={{
          width: "100%",
          height: 180,
        }}
        minHeight={48}
        enable={{
          top: true,
        }}
        style={{
          borderTop: "1px solid lightgray",
        }}
      >
        <SelectedLayer
          layers={layers}
          toggleLayers={toggleLayers}
          setLayers={setLayers}
          loadedData={loadedData}
          setViewState={setViewState}
        />
      </Resizable>
    </Box>
  );
};

export default React.memo(Menu);
