import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";

export default function CloseButton(props) {
  return (
    <IconButton
      size="small"
      style={{
        position: "absolute",
        top: 0,
        right: 0,
      }}
      {...props}
    >
      <CloseIcon />
    </IconButton>
  );
}
