import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { isValidUrl, isTile } from "../utils/utility";
import Typography from "@mui/material/Typography";
import ImportFile from "./ImportFile";
import { useLayers } from "../../hooks/useLayers";
import { Box } from "@mui/material";
import { addDefaultProps } from "../layer/addDefaultProps";

export default function ImportUrl() {
  const setLayers = useLayers((state) => state.setLayers);
  const [url, setUrl] = useState();
  const [helperText, setHelperText] = useState("");
  const isValid = (url) => isValidUrl(url) && isTile(url);

  const errorMsg = (url) =>
    url &&
    (isValidUrl(url) ? "" : "正しいURL形式ではないようです。") +
      (isTile(url) ? "" : "URLに{z}/{x}/{y}が含まれていないようです。");

  const handleChange = (e) => {
    setUrl(e.target.value);
    setHelperText(errorMsg(e.target.value));
  };
  const layers = useLayers((state) => state.layers);

  return (
    <>
      <Typography variant="h5" component="h1" style={{ marginBottom: 8 }}>
        地図タイルURLを読込
      </Typography>

      <Typography variant="body1" component="p">
        地図タイルとは、各種地図サイトが配信している、タイル状に表示される地図データです。
        URLに&#123;z&#125;/&#123;x&#125;/&#123;y&#125;のような文字を含みます。
        <br />
        URLは、
        <a
          href="https://maps.gsi.go.jp/development/ichiran.html"
          target="_blank"
          rel="noreferrer"
        >
          国土地理院（地理院タイル一覧）
        </a>
        や
        <a
          href="https://www.geospatial.jp/ckan/dataset?res_format=XYZ"
          target="_blank"
          rel="noreferrer"
        >
          G空間情報センター（XYZフォーマット）
        </a>
        等で見つけられます。
        <br />
      </Typography>

      <Box display="flex" gap="16px">
        <TextField
          id="URL"
          value={url}
          size="small"
          onChange={handleChange}
          placeholder="URLを入力してください"
          fullWidth
          error={Boolean(url && !isValid(url))}
          helperText={helperText}
        />
        <div>
          <Button
            size="small"
            color="primary"
            variant="contained"
            disabled={!isValid(url)}
            style={{ marginTop: 4 }}
            onClick={() => {
              const newLayer = addDefaultProps({
                data: url,
                id: url,
                title: url,
              });
              setLayers([newLayer, ...layers]);
              setHelperText("読み込みました。");
              setUrl("");
            }}
          >
            読込
          </Button>
        </div>
      </Box>
    </>
  );
}
