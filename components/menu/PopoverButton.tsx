import React, { useState } from "react";
import { Button } from "@material-ui/core/";

import IconButton from "@material-ui/core/IconButton";
import Popover from "./Popover";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import CloseIcon from "@material-ui/icons/Close";

const PopoverButton = ({
  icon = null,
  buttonLabel = null,
  style,
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

        {buttonLabel ? (
          <Button variant="outlined" size="small" onClick={onClick}>
            {buttonLabel}
          </Button>
        ) : null}

        <Popover anchorEl={anchorEl} handleClose={handleClose} style={style}>
          {children}
        </Popover>
      </div>
    </ClickAwayListener>
  );
};
export default PopoverButton;
