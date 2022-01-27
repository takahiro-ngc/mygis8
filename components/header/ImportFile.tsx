import Button from "@mui/material/Button";

import Typography from "@mui/material/Typography";
import { KMLLoader } from "@loaders.gl/kml";
import { load } from "@loaders.gl/core";
import { parse } from "@loaders.gl/core";
import { registerLoaders } from "@loaders.gl/core";
import { ZipLoader } from "@loaders.gl/zip";
import { ShapefileLoader, DBFLoader, SHPLoader } from "@loaders.gl/shapefile";

// registerLoaders([KMLLoader, ShapefileLoader, DBFLoader]);

// ToDo utilityへ移動
const getFileType = (fileName) => {
  const pos = fileName.lastIndexOf(".");
  return fileName.slice(pos + 1).toLowerCase();
};

export default function ImportFile({ setLayers }) {
  const importFile = async (e) => {
    const fileObject = e.target.files[0];
    const fileType = getFileType(fileObject.name);

    // const fileMap = await parse(fileObject, ZipLoader);
    // for (const fileName in fileMap) {
    //   console.log(fileName);
    // }
    // console.log(e.target.files[4]);
    load(e.target.files[0], [ShapefileLoader], undefined, {
      url: "test",
      fetch: undefined,
      parse: undefined,
    })
      // load(fileObject, [KMLLoader])
      .then((d) => {
        console.log(d, fileType);
        return {
          data: d.data,
          // data: d,
          id: fileObject.name,
          title: fileObject.name,
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
