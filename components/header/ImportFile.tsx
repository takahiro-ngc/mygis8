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

const getFileType = (fileName) => {
  const pos = fileName.lastIndexOf(".");
  return fileName.slice(pos + 1).toLowerCase();
};

export default function ImportFile({ setLayers }) {
  const importFile = (e) => {
    const fileObject = e.target.files[0];
    const fileName = fileObject.name;
    const fileType = getFileType(fileName);
    const reader = new FileReader();
    console.log("fileType", fileType);

    reader.onload = (e) => {
      const dataUrl = e.target.result;

      const newLayer = {
        ...setLayerProps(dataUrl),
        id: fileObject.name,
        title: fileObject.name,
      };
      setLayers((prev) => [newLayer, ...prev]);

      console.log("dataUrl", dataUrl);
    };
    reader.readAsDataURL(fileObject);
  };

  return (
    <>
      <div style={{ marginBottom: 8 }}>
        <Typography variant="h5" component="h1" style={{ marginBottom: 8 }}>
          地図データファイルを表示
        </Typography>
        <Typography variant="body1" component="p">
          読込できるファイル形式：shp，json，geojson，kml
        </Typography>
        <div style={{ float: "right" }}>
          <Button
            variant="contained"
            component="label"
            size="small"
            color="primary"
          >
            ファイルを選択
            <input type="file" hidden onChange={importFile} />
          </Button>
        </div>
      </div>
    </>
  );
}
