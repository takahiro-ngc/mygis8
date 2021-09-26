import React from "react";

import { ButtonBase } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

export const MenuButton = ({ isMenuVisible, setIsMenuVisible }) => {
  const handleMenuVisible = () => setIsMenuVisible(!isMenuVisible);

  return (
    <ButtonBase
      onClick={handleMenuVisible}
      sx={{
        position: "absolute",
        top: "50%",
        right: 0,
        width: 23,
        height: 48,
        borderLeft: "1px rgba(255, 255, 255, .8) solid",
        transform: "translate(100%, -50%)",
        borderRadius: "0 8px 8px 0",
        backgroundColor: "background.default",
      }}
    >
      {isMenuVisible ? (
        <ArrowBackIosNewIcon fontSize="small" />
      ) : (
        <ArrowForwardIosIcon fontSize="small" />
      )}
    </ButtonBase>
  );
};

export default React.memo(MenuButton);
