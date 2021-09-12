import React from "react";
import ReactHtmlParser from "react-html-parser";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import { isImage } from "./utility";

const FeatureInfo = ({ feature, setFeature }) => {
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
    <>
      <div className="style acrylic-color" hidden={!Boolean(feature)}>
        <IconButton
          size="small"
          style={{
            position: "fixed",
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
      </div>

      <style jsx>
        {`
          .style {
            position: absolute;
            top: 0;
            right: 0;
            min-width: 320px;
            max-width: min(40vw, 420px);
            max-height: 100%;
            overflow-x: hidden;
            overflow-y: auto;
          }
          @media screen and (max-width: 700px) {
            .style {
              max-width: 100vw;
              max-height: 60vh;
            }
          }
        `}
      </style>
    </>
  );
};

export default React.memo(FeatureInfo);
