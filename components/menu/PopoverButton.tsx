import React, { useState } from "react";
import IconButton from "@material-ui/core/IconButton";
import Popover from "./Popover";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import CloseIcon from "@material-ui/icons/Close";

const PopoverButton = ({ icon, children }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const handleClose = () => setAnchorEl(null);
  const onClick = (e) => {
    e.stopPropagation();
    setAnchorEl(anchorEl ? null : e.currentTarget);
  };

  return (
    <ClickAwayListener onClickAway={handleClose} mouseEvent="onMouseDown">
      <div>
        <IconButton size="small" onClick={onClick}>
          {icon}
        </IconButton>
        <Popover anchorEl={anchorEl} handleClose={handleClose}>
          {children}
        </Popover>
      </div>
    </ClickAwayListener>
  );
};
export default PopoverButton;
