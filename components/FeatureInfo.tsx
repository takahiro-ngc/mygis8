import React from "react";
import ReactHtmlParser from "react-html-parser";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import { isImage } from "./utils/utility";
import { Box } from "@mui/system";

const FeatureInfo = ({ feature, setFeature, isMediaQuery }) => {
  const lat = feature?.coordinate[1].toFixed(6);
  const lon = feature?.coordinate[0].toFixed(6);

  const properties = {
    "緯度・経度": `${lat} ${lon}`,
    レイヤー名: feature?.layer?.props?.title,
    ...feature?.object?.properties,
  };

  const entries = Object.entries(properties);

  const showImage = (url) => (
    <div>
      <a href={url} target="_blank" rel="noreferrer">
        <img src={url} width={"100%"} alt="サムネイル画像" />
      </a>
    </div>
  );

  const isStyleInfo = (key) => key.startsWith("_"); //_colorや_opacityなどのプロパティが地理院レイヤーにある
  const isUndefined = (value) => value === undefined;
  const shouldRender = (key, value) => !isStyleInfo(key) && !isUndefined(value);
  return (
    <Box
      sx={{
        backgroundColor: "background.default",
        position: "absolute",
        top: 0,
        right: 0,
        width: "35vw",
        minWidth: "300px",
        maxWidth: "420px",
        minHeight: "34px", //スクロールバーの表示を防ぐ（34px=IconButtonのheight）
        maxHeight: "100%",
        overflowX: "hidden",
        overflowY: "auto",
        zIndex: 2,
        ...(isMediaQuery && {
          width: "100%",
          maxWidth: "100%",
          maxHeight: "calc(50% + 24px)",
          backgroundColor: "rgba(30, 30, 30, 1)",
        }),
      }}
      hidden={!Boolean(feature)}
    >
      <IconButton
        size="small"
        style={{
          position: "absolute",
          top: 0,
          right: 0,
        }}
        onClick={() => setFeature(null)}
      >
        <CloseIcon />
      </IconButton>

      <TableContainer>
        <Table size="small">
          <TableBody>
            {entries.map(
              (row) =>
                shouldRender(row[0], row[1]) && (
                  <TableRow key={row[0]}>
                    <TableCell style={{ width: "120px" }}>
                      {ReactHtmlParser(row[0])}
                    </TableCell>
                    <TableCell style={{ wordBreak: "break-word" }}>
                      {ReactHtmlParser(row[1])}
                      {isImage(row[1]) && showImage(row[1])}
                    </TableCell>
                  </TableRow>
                )
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default React.memo(FeatureInfo);
