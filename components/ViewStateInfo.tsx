import React from "react";

import { Typography } from "@mui/material";
import { Box } from "@mui/system";

import useViewState from "../hooks/useViewState";

const ViewStateInfo = () => {
  const { zoom } = useViewState();
  const formattedZoom = zoom.toFixed(0);

  return (
    <Box
      sx={{
        backgroundColor: "background.default",
        position: "absolute",
        bottom: 0,
        right: 0,
        zIndex: 1,
        padding: "2px",
      }}
    >
      <Typography>zoom={formattedZoom}</Typography>
    </Box>
  );
};

export default React.memo(ViewStateInfo);
