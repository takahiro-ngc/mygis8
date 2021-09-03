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
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Fade from "@material-ui/core/Fade";

const FeatureInfo = ({ feature, setFeature }) => {
  const infoArray = Object.entries(feature?.object?.properties || {});
  const isStyleInfo = (row) => row.startsWith("_"); //_colorや_opacityなどのプロパティが地理院レイヤーにあり
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
              <TableRow key={"緯度/経度"}>
                <TableCell>緯度/経度</TableCell>
                <TableCell>
                  {feature?.coordinate[1].toFixed(6)},
                  {feature?.coordinate[0].toFixed(6)}
                </TableCell>
              </TableRow>

              {feature?.layer && (
                <TableRow key={"@@レイヤ"}>
                  <TableCell>レイヤー名</TableCell>
                  <TableCell>{feature.layer?.props?.title}</TableCell>
                </TableRow>
              )}

              {infoArray?.map(
                (row) =>
                  !isStyleInfo(row[0]) && (
                    <TableRow key={row[0]}>
                      <TableCell>{ReactHtmlParser(row[0])}</TableCell>
                      <TableCell>
                        {ReactHtmlParser(row[1])}
                        {isImage(row[1]) && (
                          <div>
                            <a
                              href={`${row[1]}`}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <img
                                src={`${row[1]}`}
                                width={200}
                                alt="サムネイル画像"
                              />
                            </a>
                          </div>
                        )}
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
            top: 48px; //headerHight
            right: 0;
            min-width: 320px;
            max-width: min(40vw, 380px);
            max-height: calc(100% - 48px); //headerHeight
            overflow: auto;
            z-index: 1;
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
