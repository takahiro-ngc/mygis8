import React, { useState } from "react";
import { Button } from "@material-ui/core/";

import IconButton from "@material-ui/core/IconButton";
import Popover from "./Popover";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import CloseIcon from "@material-ui/icons/Close";

const PopoverButton = ({
  icon = null,
  style,
  popoverStyle,
  buttonStyle,
  children,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const handleClose = () => setAnchorEl(null);
  const onClick = (e) => {
    e.stopPropagation();
    setAnchorEl(anchorEl ? null : e.currentTarget);
  };

  return (
    <ClickAwayListener onClickAway={handleClose} mouseEvent="onMouseDown">
      <div>
        {icon ? (
          <IconButton size="small" onClick={onClick}>
            {icon}
          </IconButton>
        ) : null}

        {buttonStyle ? (
          <Button
            variant="outlined"
            size="small"
            onClick={onClick}
            {...buttonStyle}
          />
        ) : null}

        <Popover
          anchorEl={anchorEl}
          handleClose={handleClose}
          style={style}
          popoverStyle={popoverStyle}
        >
          {children}
        </Popover>
      </div>
    </ClickAwayListener>
  );
};
export default PopoverButton;
