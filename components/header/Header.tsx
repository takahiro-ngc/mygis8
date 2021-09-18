import React from "react";

import { Typography } from "@mui/material";
import { Button } from "@mui/material/";
import PopoverButton from "../menu/PopoverButton";
import Faq from "./Faq";
import Import from "./Import";
import ShareIcon from "@mui/icons-material/Share";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import { defaultMode, drawMode } from "../EditMode";

import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import useMediaQuery from "@mui/material/useMediaQuery";

import LooksTwoOutlinedIcon from "@mui/icons-material/LooksTwoOutlined";

const Header = ({ setLayers, setIsDoubleView }) => {
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
        // zIndex: 1,
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

          {/* <Button
            size="small"
            variant="outlined"
            onClick={() =>
              setModeOfEdit((prev) =>
                prev.id === "ViewMode"
                  ? drawMode.find((d) => d.id === "DrawPolygonMode")
                  : defaultMode.find((d) => d.id === "ViewMode")
              )
            }
            // startIcon={<LooksTwoOutlinedIcon />}
          >
            計測・作図
          </Button> */}

          <Item label="FAQ" icon={<HelpOutlineIcon />}>
            <Faq />
          </Item>
        </>
      </div>
    </div>
  );
};

export default React.memo(Header);
