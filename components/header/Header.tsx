import React, { useState, useMemo } from "react";

import { Typography } from "@material-ui/core";
import { Button } from "@material-ui/core/";
import PopoverButton from "../menu/PopoverButton";
import Faq from "./Faq";
import Import from "./Import";
import ShareIcon from "@material-ui/icons/Share";
import ImportExportIcon from "@material-ui/icons/ImportExport";

import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import LooksTwoOutlinedIcon from "@material-ui/icons/LooksTwoOutlined";

export const Header = React.memo(({ setLayers, setIsDoubleView }) => {
  const matches = useMediaQuery("(min-width:500px)");
  const Item = ({ label, icon, children }) => (
    <>
      {matches ? (
        <PopoverButton
          style={{ width: 800 }}
          popoverStyle={{ placement: "bottom" }}
          buttonStyle={{
            children: label,
            startIcon: icon,
          }}
        >
          {children}
        </PopoverButton>
      ) : (
        <PopoverButton
          style={{ width: 800 }}
          popoverStyle={{ placement: "bottom" }}
          icon={icon}
        >
          {children}
        </PopoverButton>
      )}
    </>
  );

  return (
    <div
      style={{
        width: "100%",
        zIndex: 1,
        padding: 8,
        display: "flex",
        alignItems: "center",
        background: "rgba(50, 50, 50)",
      }}
    >
      <Typography variant="h5" component="h1">
        色々な地図。
      </Typography>

      <div style={{ display: "flex", gap: 8, marginLeft: "auto" }}>
        <>
          <Button
            size="small"
            variant="outlined"
            onClick={() => setIsDoubleView((prev) => !prev)}
            startIcon={<LooksTwoOutlinedIcon />}
          >
            二画面
          </Button>
          <Item label="共有" icon={<ShareIcon />}>
            {/* <Import setLayers={setLayers} /> */}
          </Item>

          <Item label="インポート" icon={<ImportExportIcon />}>
            <Import setLayers={setLayers} />
          </Item>

          <Item label="FAQ" icon={<HelpOutlineIcon />}>
            <Faq />
          </Item>
        </>
      </div>
    </div>
  );
});
