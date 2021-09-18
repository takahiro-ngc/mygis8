import React, { useState } from "react";

import Typography from "@mui/material/Typography";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import IconButton from "@mui/material/IconButton";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";

const Header = ({ setIsMenuVisible, isMainView }) => {
  return (
    <div
      style={{
        display: "flex",
      }}
    >
      <Typography variant="h6" component="h2" display="inline">
        地図の種類
      </Typography>

      <IconButton
        size="small"
        onClick={() => setIsMenuVisible(false)}
        style={{ marginLeft: "auto" }}
      >
        {isMainView ? <ArrowBackIcon /> : <ArrowForwardIcon />}
      </IconButton>
    </div>
  );
};

export default Header;
