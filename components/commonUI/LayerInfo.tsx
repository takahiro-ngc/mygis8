import ReactHtmlParser from "react-html-parser";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { isImage } from "../utils/utility";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Image from "next/image";

export default function LayerInfo({ node }) {
  const category = node.category?.map((d) => `${d} > `);
  const description = ReactHtmlParser(node.html);
  const legend = (
    <Link href={node.legendUrl} target="_blank" rel="noreferrer">
      {isImage(node.legendUrl) ? (
        <Image src={node.legendUrl} alt="凡例画像" width="100%" />
      ) : (
        node.legendUrl
      )}
    </Link>
  );
  const attribution = (
    <Link href={node.attributionUrl} target="_blank" rel="noreferrer">
      {node.attributionName}
    </Link>
  );

  // 地理院データはminZoomが実態と１ずれるよう
  // ベクターの場合は違う？
  const minZoom =
    node.category?.[0] === "国土地理院" ? node.minZoom - 1 : node.minZoom;
  const setting = (
    <>{minZoom > 1 && `ズームレベルが${minZoom}以上で表示されます。`}</>
  );
  const table = {
    出典: attribution,
    凡例: legend,
    説明: description,
    備考: node.notes,
    表示設定: setting,
  };

  return (
    <>
      <Typography variant="caption">{category}</Typography>
      <Typography variant="h6">{node.title}</Typography>

      <TableContainer>
        <Table size="small">
          <TableBody>
            {Object.entries(table).map((row) => (
              <TableRow key={row[0]}>
                <TableCell style={{ width: "90px" }}>{row[0]}</TableCell>
                <TableCell>{row[1]}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
