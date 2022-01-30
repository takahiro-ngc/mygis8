import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Box from "@mui/system/Box";
import React from "react";
import ReactHtmlParser from "react-html-parser";
import CloseButton from "./commonUI/CloseButton";
import { isImage } from "./utils/utility";

const FeatureInfo = ({ clickedFeature, setClickedFeature, isMediaQuery }) => {
  const lat = clickedFeature?.coordinate[1].toFixed(6);
  const lon = clickedFeature?.coordinate[0].toFixed(6);

  const FeatureProperties = {
    "緯度・経度": `${lat} ${lon}`,
    レイヤー名: clickedFeature?.layer?.props?.title,
    ...clickedFeature?.object?.properties,
  };

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
      hidden={!clickedFeature}
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
          backgroundColor: "rgba(50, 50, 50)",
        }),
      }}
    >
      <CloseButton onClick={() => setClickedFeature(null)} />

      <TableContainer>
        <Table size="small">
          <TableBody>
            {Object.entries(FeatureProperties).map(
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
