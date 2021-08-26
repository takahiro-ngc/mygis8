import React from "react";
import ReactHtmlParser from "react-html-parser";
import Typography from "@material-ui/core/Typography";

const isString = (data) => typeof data === "string";
// ToDO layerSettingsTableを使わずに
const LayerInfo = ({ node }) => {
  // https://github.com/gsi-cyberjapan/layers-dot-txt-spec/blob/master/specifications.md
  const layerTxtSpec = [
    "type",
    "id",
    "title",
    "url",
    "subdomains",
    "attribution",
    // "cocotile",
    "minZoom",
    "maxZoom",
    "maxNativeZoom",
    // "iconUrl",
    "legendUrl",
    "styleurl",
    "errorTileUrl",
    "bounds",
    "area",
    "html",
  ];

  // attribution
  // minzoom
  // maxzoom

  const specList = layerTxtSpec.map(
    (d) =>
      node[d] && (
        <div
          style={{
            display: "flex",
          }}
        >
          <span style={{ width: "30%" }}>{`${d}`}</span>
          <span style={{ width: "70%" }}>{`${node[d]}`}</span>
        </div>
      )
  );

  const category = (list) => list.map((d) => <span>{d} &gt; </span>);
  return (
    <div>
      <Typography variant="caption">{category(node.category)}</Typography>
      <Typography variant="h5" component="h1" style={{ marginBottom: 8 }}>
        {node.title}
      </Typography>

      {specList}
      {node.html && (
        <>
          <div style={{ border: "1px lightgray solid", padding: 8 }}>
            <b>説明（国土地理院より引用）</b>
            {isString(node.html) ? ReactHtmlParser(node.html) : node.html}
          </div>
          <div>
            ※本サイトでは，国土地理院のサイト（地理院地図）の地図のうち，主な地図のみ掲載しています。
            また，一部データは，正常に動作・表示しないものがあります（クリックして特別な挙動をするもの等）。
            <br />
            本来の動作・表示は，地理院地図で確認できます。
            <br />
          </div>
        </>
      )}

      {node.legendUrl && (
        <>
          <b>凡例</b>
          <a href={node.legendUrl} target="_blank" rel="noreferrer">
            {node.legendUrl}
          </a>
        </>
      )}
    </div>
  );
};
export default LayerInfo;
