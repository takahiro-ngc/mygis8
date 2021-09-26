import React, { useState } from "react";
import ReactHtmlParser from "react-html-parser";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { isImage } from "../utils/utility";
import { Skeleton } from "@mui/material";

export default function LayerInfo({ node }) {
  const category = node.category.map((d) => `${d} > `);

  const description = ReactHtmlParser(node.html);

  const [loaded, setLoaded] = useState(false);

  const legend = (
    <Link href={node.legendUrl} target="_blank" rel="noreferrer">
      {isImage(node.legendUrl) ? (
        <>
          {loaded || (
            <Skeleton variant="rectangular" width="100%" height={200} />
          )}
          <img
            src={node.legendUrl}
            alt="凡例画像"
            width="100%"
            onLoad={() => setLoaded(true)}
            style={{ display: `${loaded || "none"}` }}
          />
        </>
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
  const minZoom =
    node.category[0] === "国土地理院" ? node.minZoom - 1 : node.minZoom;

  return (
    <div>
      <Typography variant="caption">{category}</Typography>

      <Typography variant="h5" component="h1">
        {node.title}
      </Typography>

      <Typography variant="body1">
        <dl>
          <div>
            <dt>出典</dt>
            <dd>{attribution}</dd>
          </div>
          <div>
            <dt>凡例</dt>
            <dd>{legend}</dd>
          </div>
          <div>
            <dt>説明</dt>
            <dd>{description}</dd>
          </div>
          <div>
            <dt>備考</dt>
            <dd>{node.notes}</dd>
          </div>

          <div>
            <dt>表示設定</dt>
            <dd>
              {node.toggleall &&
                "カテゴリー内の全データを表示すると，本来の動作に近くなります。"}
              {node.minZoom > 1 && `ズームレベルが${minZoom}以上で表示`}
            </dd>
          </div>
        </dl>
      </Typography>

      <style jsx>
        {`
          dl {
            margin: 0;
          }
          dl div {
            display: flex;
            border-bottom: 1px rgb(81, 81, 81) solid;
            padding: 8px;
          }
          dt {
            width: 20%;
          }
          dd {
            width: 80%;
            margin: 0;
          }
        `}
      </style>
    </div>
  );
}
