import React, { useState, useCallback, useReducer, useRef } from "react";
import { Resizable } from "re-resizable";
import { Box } from "@mui/system";
import DataCatalog from "./menu/DataCatalog";
import SelectedLayerList from "./menu/selectedLayer/SelectedLayerList";

import MenuButton from "./menu/MenuButton";

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
    (layers) => dispatch({ type: "set", layer: layers }),
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
      <MenuButton
        isMenuVisible={isMenuVisible}
        toggleMenuVisible={toggleMenuVisible}
        isMediaQuery={isMediaQuery}
      />
      <DataCatalog toggleLayers={toggleLayers} setViewState={setViewState} />
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
        {layerInstance[0].state?.features?.pointFeatures[0].__source.object.toString()}
        {JSON.stringify(
          layerInstance[0].state?.features?.pointFeatures[0].__source.object
            .geometry
          //    layerInstance[0].state?.tileset?._selectedTiles[0].content?.features
          // ?.geometry?.type
          // getCircularReplacer()
          // layerInstance[0].state?.tileset?._selectedTiles?.content?.features
        )}
        <SelectedLayerList
          layers={layers}
          toggleLayers={toggleLayers}
          setLayers={setLayers}
          loadedData={loadedData}
          setViewState={setViewState}
        ></SelectedLayerList>
      </Resizable>
    </Box>
  );
};

export default React.memo(Menu);
