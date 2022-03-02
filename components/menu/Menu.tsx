import React, { useState, useCallback, useReducer, useRef } from "react";
import { Resizable } from "re-resizable";
import { Box } from "@mui/system";
import LayerTree from "./LayerTree";
import SelectedLayer from "./selectedLayer/SelectedLayer";
import SelectedLayerTest from "./selectedLayer/SelectedLayerTest";
import ToggleMenuButton from "./ToggleMenuButton";
import SettingsIcon from "@mui/icons-material/Settings";

export const Menu = ({
  layers,
  storedData,
  setLayers,
  toggleLayer,
  setViewState,
  isMediaQuery,
  changeLayerProps,
}) => {
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
      <LayerTree toggleLayer={toggleLayer} />
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
        {/* <SelectedLayer
          layers={layers}
          handleLayer={handleLayer}
          storedData={storedData}
          setViewState={setViewState}
        /> */}
        <SelectedLayerTest
          layers={layers}
          storedData={storedData}
          setLayers={setLayers}
          toggleLayer={toggleLayer}
          setViewState={setViewState}
          changeLayerProps={changeLayerProps}
        />
      </Resizable>
    </Box>
  );
};

export default React.memo(Menu);
