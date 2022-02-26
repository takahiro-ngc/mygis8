import React from "react";

import { Typography } from "@mui/material";
import { Button } from "@mui/material/";
import PopoverButton from "../commonUI/PopoverButton";
import Faq from "./Faq";
import Import from "./Import";
import ShareIcon from "@mui/icons-material/Share";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import { defaultMode, drawMode } from "../EditMode";

import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import useMediaQuery from "@mui/material/useMediaQuery";

import LooksTwoOutlinedIcon from "@mui/icons-material/LooksTwoOutlined";

const Header = ({ setLayers }) => {
  const matches = useMediaQuery("(min-width:500px)");
  const Item = ({ label, icon, children }) => (
    <>
      {matches ? (
        <PopoverButton
          width={800}
          placement="bottom"
          button={
            <Button
              variant="outlined"
              size="small"
              children={label}
              startIcon={icon}
            />
          }
        >
          {children}
        </PopoverButton>
      ) : (
        // ToDo ボタンの処理
        <PopoverButton width={800} placement="bottom" icon={icon}>
          {children}
        </PopoverButton>
      )}
    </>
  );

  return (
    <div
      style={{
        width: "100%",
        zIndex: 2,
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
