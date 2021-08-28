import React from "react";
import ReactHtmlParser from "react-html-parser";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import { isImage } from "../utility";

const isString = (data) => typeof data === "string";
// ToDO layerSettingsTableを使わずに
export default function LayerInfo({ node }) {
  // https://github.com/gsi-cyberjapan/layers-dot-txt-spec/blob/master/specifications.md

  const category = node.category.map((d) => `${d} > `);

  const description = isString(node.html)
    ? ReactHtmlParser(node.html)
    : node.html;

  const legend = (
    <>
      {isImage(node.legendUrl) ? (
        <img src={node.legendUrl} alt="凡例画像" />
      ) : (
        <Link href={node.legendUrl} target="_blank" rel="noreferrer">
          {node.legendUrl}
        </Link>
      )}
    </>
  );

  const attribution = (
    <Link href={node.attributionUrl} target="_blank" rel="noreferrer">
      {node.attributionName}
    </Link>
  );

  const notes = (
    <div style={{ border: "1px lightgray solid", padding: 8 }}>
      ・上の説明は，出典からの引用です。
      <br />
      ・特別な設定のある一部データは，本サイト上では，正常に動作しない機能や説明と異なる表示があります。
    </div>
  );

  return (
    <div>
      <Typography variant="caption">{category}</Typography>

      <Typography variant="h5" component="h1">
        {node.title}
      </Typography>

      <Typography variant="body1" style={{ paddingTop: 8 }}>
        出典：{attribution}
      </Typography>

      {node.legendUrl && (
        <Typography variant="body1" style={{ paddingTop: 8 }}>
          凡例：{legend}
        </Typography>
      )}

      {node.html && (
        <Typography variant="body1" style={{ paddingTop: 8 }}>
          説明：{description}
        </Typography>
      )}

      {node.notes && (
        <Typography variant="body1" style={{ paddingTop: 8 }}>
          補足：{node.notes}
        </Typography>
      )}
    </div>
  );
}
