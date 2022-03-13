import React from "react";

import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import ShareIcon from "@mui/icons-material/Share";
import { Box, IconButton, Typography } from "@mui/material";
import { Button } from "@mui/material/";
// import { defaultMode, drawMode } from "../EditMode";
import useMediaQuery from "@mui/material/useMediaQuery";
import Import from "./Import";
import PopoverButton from "../commonUI/PopoverButton";
import { mediaQuery } from "../utils/utility";
import Edit from "../Edit";
import Faq from "./Faq";
import { useLayers } from "../../hooks/useLayers";
import { ViewMode } from "nebula.gl";
import { isEditingCondition } from "../utils/utility";

const Header = () => {
  const isMediaQuery = useMediaQuery(mediaQuery);

  const Item = ({ label, icon, children }) => (
    <PopoverButton
      width={800}
      placement="bottom"
      button={
        isMediaQuery ? (
          <IconButton size="small">{icon}</IconButton>
        ) : (
          <Button variant="outlined" size="small" startIcon={icon}>
            {label}
          </Button>
        )
      }
    >
      {children}
    </PopoverButton>
  );

  return (
    <Box padding={1} display="flex" zIndex={2}>
      <Typography variant="h5" component="h1">
        色々な地図。
      </Typography>

      <Box display="flex" gap={1} marginLeft="auto">
        <>
          <Item label="共有" icon={<ShareIcon />}>
            {/* <Import setLayers={setLayers} /> */}
          </Item>

          <Item label="インポート" icon={<ImportExportIcon />}>
            <Import />
          </Item>

          <Item label="FAQ" icon={<HelpOutlineIcon />}>
            <Faq />
          </Item>
        </>
      </Box>
    </Box>
  );
};

export default React.memo(Header);
