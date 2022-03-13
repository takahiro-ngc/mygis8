import { Resizable } from "re-resizable";
import React, { useReducer } from "react";

import useMediaQuery from "@mui/material/useMediaQuery";
import { Box } from "@mui/system";

import { mediaQuery } from "../utils/utility";
import LayerTree from "./LayerTree";
import SelectedLayer from "./selectedLayer/SelectedLayer";
import ToggleMenuButton from "./ToggleMenuButton";

export const Menu = () => {
  const [isMenuVisible, toggleMenuVisible] = useReducer((prev) => !prev, true);
  const isMediaQuery = useMediaQuery(mediaQuery);

  return (
    <Box
      sx={{
        transform: `${isMenuVisible || "translate(-100%)"}`,
        transition: "transform 230ms ease-in-out",
        zIndex: 1,
        position: "absolute",
        height: "100%",
        width: "clamp(300px, 35vw, 400px)",
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
      <LayerTree />
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
        <SelectedLayer />
      </Resizable>
    </Box>
  );
};

export default React.memo(Menu);
