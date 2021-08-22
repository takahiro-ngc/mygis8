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

export default function ImportFile({ setLayers }) {
  const [file, setFile] = useState({ file: "", fileUrl: "test" });

  const handleFileChange = (e) => {
    const fileObject = e.target.files[0];
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        resolve(event.target.result);
      };
      reader.readAsDataURL(fileObject);
    }).then((result) => {
      setLayers((prev) => [
        {
          ...setLayerProps(result),
          id: fileObject.name,
          title: fileObject.name,
        },
        ...prev,
      ]);
    });
  };
  //   const reader = new FileReader();
  //   const targetFile = e.target.files[0];
  //   reader.onload = (event) => {
  //     setFile({
  //       file: targetFile,
  //       fileUrl: reader.result,
  //     });
  //     console.log(e.target);
  //     setLayers((prev) => [
  //       {
  //         ...setLayerProps(file.fileUrl),
  //         id: file.file.name,
  //         title: file.file.name,
  //       },
  //       ...prev,
  //     ]);
  //   };

  //   reader.readAsDataURL(targetFile);
  //   console.log(file);
  // };

  // const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  // const file = e.target.files;
  // // const fileName = file[0].name;
  // console.log(file);
  // console.log(file.path);

  // };
  return (
    <>
      <div style={{ marginBottom: 8 }}>
        <Typography variant="h5" component="h1" style={{ marginBottom: 8 }}>
          地図データファイルを表示
        </Typography>
        <Typography variant="body1" component="p">
          読込できるファイル形式：shp，json，geojson，kml
        </Typography>
        <Button
          variant="contained"
          component="label"
          size="small"
          color="primary"
        >
          ファイルを選択
          <input type="file" hidden onChange={handleFileChange} />
          {/* <input type="file" hidden onChange={onFileInputChange} /> */}
        </Button>
      </div>
    </>
  );
}
