import React, { useState, useCallback } from "react";
import Button from "@material-ui/core/Button";
import { FlyToInterpolator } from "deck.gl";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import TextField from "@material-ui/core/TextField";
import { isValidUrl, isTile } from "../utility";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import { setLayerProps } from "../layer/layerProps";
import Typography from "@material-ui/core/Typography";

export default function Import({ setLayers }) {
  const [url, setUrl] = useState("");
  const errorMsg = (url) =>
    url &&
    (isValidUrl(url) ? "" : "正しいURL形式ではありません。") +
      (isTile(url) ? "" : "URLに{z}/{x}/{y}が含まれていません。");

  const isValid = (url) => isValidUrl(url) && isTile(url);
  const [helperText, setHelperText] = useState("");
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value);
    setHelperText(errorMsg(event.target.value));
  };

  return (
    <>
      <div style={{ marginBottom: 8 }}>
        <Typography variant="h5" component="h1" style={{ marginBottom: 8 }}>
          URLから地図タイルを表示
        </Typography>
        <Typography variant="body1" component="p">
          地図タイルとは，各種地図サイトが配信している，タイル状に表示される地図データです。
          URLに&#123;z&#125;/&#123;x&#125;/&#123;y&#125;のような文字を含みます。
          <br />
          URLは，
          <a
            href="https://maps.gsi.go.jp/development/ichiran.html"
            target="_blank"
            rel="noreferrer"
          >
            国土地理院の地理院タイル一覧
          </a>
          や
          <a
            href="https://www.geospatial.jp/ckan/dataset?res_format=XYZ"
            target="_blank"
            rel="noreferrer"
          >
            G空間情報センターでの検索結果
          </a>
          等で見つけられます。
          <br />
        </Typography>
      </div>
      <div style={{ display: "flex", gap: 16 }}>
        <TextField
          id="URL"
          value={url}
          onChange={handleChange}
          placeholder="URLを入力してください"
          fullWidth
          error={Boolean(url && !isValid(url))}
          helperText={helperText}
          style={{}}
        />
        <div>
          <Button
            size="small"
            color="primary"
            variant="contained"
            disabled={Boolean(url && !isValid(url))}
            style={{ textAlign: "right", marginTop: 8 }}
            onClick={() =>
              // ToDo histry
              url
                ? (setLayers((prev) => [
                    { ...setLayerProps(url), id: url, title: url },
                    ...prev,
                  ]),
                  setHelperText("「選択中のデータ」に追加しました。"),
                  setUrl(""))
                : setHelperText("URLが入力されていません。")
            }
          >
            読込
          </Button>
        </div>
      </div>
    </>
  );
}
