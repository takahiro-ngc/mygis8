import React from "react";
import ReactHtmlParser from "react-html-parser";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import { isImage } from "../utility";

export default function LayerInfo({ node }) {
  const category = node.category.map((d) => `${d} > `);

  const isString = (data) => typeof data === "string";
  const description = isString(node.html)
    ? ReactHtmlParser(node.html)
    : node.html;

  const legend = (
    <Link href={node.legendUrl} target="_blank" rel="noreferrer">
      {isImage(node.legendUrl) ? (
        <img src={node.legendUrl} alt="凡例画像" width="100%" />
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

  const notesFortoggleall = (
    <div>
      ・このカテゴリー内のデータは，全て選択すると，本来の表示に近くなります。
    </div>
  );
  const notesForMinZoom = (
    <div>
      ・このデータは，対象のエリアで，ズームレベルを〇以上に拡大すると表示されます。
    </div>
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
                "このカテゴリー内の全てのデータを選択すると，本来の表示に近くなります。"}
              {isImage(node.fileType) &&
                node.minZoom > 0 &&
                `対象のエリアにおいて，ズームレベルが${minZoom}以上で表示されます。`}
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
