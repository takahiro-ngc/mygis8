import React, { useState } from "react";
import Popper from "@material-ui/core/Popper";
import Fade from "@material-ui/core/Fade";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";

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
        zIndex: 1,
        padding: 16,
        width: 420,
        maxWidth: "95vw",
        maxHeight: "calc(100vh - 16px)",
        overflow: "auto",
        wordBreak: "break-all",
        borderRadius: 8,
        ...style,
      }}
      transition
      onClick={(e) => e.stopPropagation()}
      modifiers={{
        flip: {
          enabled: false,
        },
        preventOverflow: {
          enabled: true,
          boundariesElement: "viewport",
        },
      }}
      {...popoverStyle}
    >
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={150}>
          <div>
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
