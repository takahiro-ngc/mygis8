import React, { useState } from "react";
import Popper from "@material-ui/core/Popper";
import Fade from "@material-ui/core/Fade";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";

export default function Popover({ anchorEl, children, handleClose }) {
  const open = Boolean(anchorEl);

  return (
    <Popper
      open={open}
      anchorEl={anchorEl}
      placement="right"
      style={{ zIndex: 1 }}
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
    >
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={150}>
          <div
            style={{
              padding: 16,
              width: 400,
              maxWidth: "100vw",
              maxHeight: "calc(100vh - 16px)",
              overflow: "auto",
              wordBreak: "break-all",
              borderRadius: 4,
            }}
            className="acrylic-color-dark"
          >
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