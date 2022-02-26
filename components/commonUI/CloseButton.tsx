import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";

export default function CloseButton(props) {
  return (
    <IconButton
      // ToDo sticky
      size="small"
      style={{
        position: "absolute",
        // position: "sticky",
        // marginLeft: "100px",
        // top: 0,
        right: 0,
        // float: "right",
      }}
      {...props}
    >
      <CloseIcon />
    </IconButton>
  );
}
