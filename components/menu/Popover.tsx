import React, { useState } from "react";
import Popper from "@mui/material/Popper";
import Fade from "@mui/material/Fade";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";

export default function Popover({
  anchorEl,
  children,
  handleClose,
  style,
  popoverStyle,
}) {
  const open = Boolean(anchorEl);

  return (
    <Popper
      className="acrylic-color-dark"
      open={open}
      anchorEl={anchorEl}
      placement="right"
      style={{
        zIndex: 2,
        padding: 16,
        width: 440,
        maxWidth: "100vw",
        maxHeight: "100vh",
        overflow: "auto",
        wordBreak: "break-all",
        borderRadius: 8,
        ...style,
      }}
      transition
      onClick={(e) => e.stopPropagation()}
      modifiers={[
        {
          name: "flip",
          enabled: false,
        },

        {
          name: "preventOverflow",
          enabled: true,
          options: {
            altAxis: true,
            tether: true,
          },
        },
      ]}
      {...popoverStyle}
    >
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={150}>
          <div style={{ zIndex: 100 }}>
            {children}
            <IconButton
              size="small"
              style={{ position: "absolute", top: 0, right: 0 }}
              onClick={handleClose}
            >
              <CloseIcon />
            </IconButton>
          </div>
        </Fade>
      )}
    </Popper>
  );
}
