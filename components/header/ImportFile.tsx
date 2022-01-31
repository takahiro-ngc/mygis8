import Button from "@mui/material/Button";

import Typography from "@mui/material/Typography";
import { KMLLoader } from "@loaders.gl/kml";
import { load } from "@loaders.gl/core";
import { parse } from "@loaders.gl/core";
import { registerLoaders } from "@loaders.gl/core";
import { ZipLoader } from "@loaders.gl/zip";
import { ShapefileLoader, DBFLoader, SHPLoader } from "../../shapefile/src";
// import { ShapefileLoader, DBFLoader, SHPLoader } from "@loaders.gl/shapefile";

// registerLoaders([KMLLoader, ShapefileLoader, DBFLoader, SHPLoader]);

// ToDo utilityへ移動
const getFileType = (fileName) => {
  const pos = fileName.lastIndexOf(".");
  return fileName.slice(pos + 1).toLowerCase();
};

export default function ImportFile({ setLayers }) {
  const importFile = async (e) => {
    const fileObject = e.target.files[0];
    const fileType = getFileType(fileObject.name);
    console.log("e.target", e.target.files);

    // const files=e.target.files
    // const fileLength= files.length
    // let fileIndex=0
    // // each関数？
    // // const fileType = getFileType(files[fileIndex]);
    // fileType==="shp"

    // fileType==="other"

    // zipなら解凍する

    // const fileMap = await parse(fileObject, ZipLoader);
    // for (const fileName in fileMap) {
    //   console.log(fileName);
    // }
    // console.log(e.target.files[4]);
    // load(e.target.files[0], [ShapefileLoader, DBFLoader, SHPLoader], {
    //   files: e.target.files[0],
    // })
    load(fileObject, [KMLLoader, ShapefileLoader, DBFLoader, SHPLoader])
      .then((d) => {
        console.log(d, fileType);
        return {
          // シェープファイルの場合はd.data
          // data: d.data,
          data: fileType === "shp" ? d.data : d,
          id: fileObject.name,
          title: fileObject.name,

          // TToDo importFileのために必要
          // ...addDefaultProps(d),
        };
      })
      .then((newLayer) => setLayers((prev) => [newLayer, ...prev]));
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
            <input type="file" multiple hidden onChange={importFile} />
          </Button>
        </div>
      </div>
    </>
  );
}
