import React, { useState } from "react";

import IconButton from "@mui/material/IconButton";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import CloseIcon from "@mui/icons-material/Close";
import Popper from "@mui/material/Popper";
import Fade from "@mui/material/Fade";

const PopoverButton = ({
  button,
  width = 440,
  placement = "right",
  children,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClose = () => setAnchorEl(null);
  const handleClick = (e) => {
    setAnchorEl(open ? null : e.currentTarget);
    e.stopPropagation(); //treeの開閉を防ぐ
  };

  return (
    <ClickAwayListener onClickAway={handleClose} mouseEvent="onMouseDown">
      <div>
        <span onClick={handleClick}>{button}</span>

        <Popper
          className="acrylic-color-dark"
          open={open}
          anchorEl={anchorEl}
          placement={placement}
          style={{
            zIndex: 2,
            padding: 16,
            width: width,
            maxWidth: "100vw",
            maxHeight: "100vh",
            overflow: "auto",
            wordBreak: "break-all",
            borderRadius: 8,
          }}
          transition
          onClick={(e) => e.stopPropagation()} //treeの開閉を防ぐ
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
      </div>
    </ClickAwayListener>
  );
};
export default React.memo(PopoverButton);
