import React from "react";
import ReactHtmlParser from "react-html-parser";

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

  return (
    <div>
      <div>{node.title}</div>
      {specList}

      {node.html && (
        <div style={{ border: "1px lightgray solid", padding: 8 }}>
          <b>説明（国土地理院より引用）</b>
          {isString(node.html) ? ReactHtmlParser(node.html) : node.html}
        </div>
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
