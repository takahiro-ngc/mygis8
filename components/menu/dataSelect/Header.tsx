import React, { useState } from "react";

import { Typography } from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import IconButton from "@material-ui/core/IconButton";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import TextField from "@material-ui/core/TextField";
import SearchIcon from "@material-ui/icons/Search";

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
