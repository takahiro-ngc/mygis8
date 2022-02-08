import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import React from "react";
import ReactHtmlParser from "react-html-parser";
import CloseButton from "./commonUI/CloseButton";
import { isImage } from "./utils/utility";
import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";

const FeatureInfo = ({ clickedFeature, setClickedFeature, isMediaQuery }) => {
  // const lat = clickedFeature?.object?.geometry?.coordinates[1];
  // const lon = clickedFeature?.object?.geometry?.coordinates[0];
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
    <SimpleBar
      hidden={!clickedFeature}
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        width: "25vw",
        minWidth: "320px",
        maxWidth: "420px",
        maxHeight: "100%",
        zIndex: 2,
        ...(isMediaQuery && {
          minWidth: "100%",
          maxHeight: "calc(50% + 24px)",
        }),
      }}
    >
      <CloseButton onClick={() => setClickedFeature(null)} />

      <TableContainer
        sx={{
          backgroundColor: isMediaQuery
            ? "rgba(50, 50, 50)"
            : "background.default",
        }}
      >
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
    </SimpleBar>
  );
};

export default React.memo(FeatureInfo);
