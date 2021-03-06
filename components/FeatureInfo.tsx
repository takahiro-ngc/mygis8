import React from "react";
import ReactHtmlParser from "react-html-parser";
import SimpleBar from "simplebar-react";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import useMediaQuery from "@mui/material/useMediaQuery";

import { mediaQuery } from "./utils/utility";
import CloseButton from "./commonUI/CloseButton";
import { isImage } from "./utils/utility";

const FeatureInfo = ({ clickedFeature, setClickedFeature }) => {
  const isMediaQuery = useMediaQuery(mediaQuery);

  const lat = clickedFeature?.coordinate?.[1].toFixed(6);
  const lon = clickedFeature?.coordinate?.[0].toFixed(6);

  const FeatureProperties = {
    "緯度・経度": `${lat}　${lon}`,
    レイヤー名: clickedFeature?.layer?.props?.title,
    ...clickedFeature?.object?.properties,
  };

  const showImage = (url) => (
    <div>
      <a href={url} target="_blank" rel="noreferrer">
        <img src={url} width="100%" alt="サムネイル画像" />
      </a>
    </div>
  );

  const isStyleInfo = (key) => key.startsWith("_"); //地理院レイヤーの_colorや_opacityなど
  const isUndefined = (value) => value === undefined;
  const shouldRender = (key, value) => !isStyleInfo(key) && !isUndefined(value);

  return (
    <SimpleBar
      hidden={!clickedFeature}
      style={{
        position: "absolute",
        right: 0,
        width: "clamp(320px, 25vw, 420px)",
        maxHeight: "100%",
        zIndex: 2,
        ...(isMediaQuery && {
          width: "100%",
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
