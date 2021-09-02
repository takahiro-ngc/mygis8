import Button from "@material-ui/core/Button";

import { setProps } from "../layer/layerProps";
import Typography from "@material-ui/core/Typography";
import { KMLLoader } from "@loaders.gl/kml";
import { load } from "@loaders.gl/core";
import { registerLoaders } from "@loaders.gl/core";
import { ZipLoader } from "@loaders.gl/zip";
import { ShapefileLoader, DBFLoader } from "@loaders.gl/shapefile";
// registerLoaders([KMLLoader, ShapefileLoader, DBFLoader]);

const getFileType = (fileName) => {
  const pos = fileName.lastIndexOf(".");
  return fileName.slice(pos + 1).toLowerCase();
};

// ToDO isTileでエラーなので，仮削除中
export default function ImportFile({ setLayers }) {
  const importFile = async (e) => {
    const fileObject = e.target.files[0];
    const fileName = fileObject.name;
    const fileType = getFileType(fileName);

    await load(fileObject, [KMLLoader])
      .then((d) => {
        console.log(d, fileType);
        return {
          ...setProps(d, fileType),
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
            <input type="file" hidden onChange={importFile} multiple />
          </Button>
        </div>
      </div>
    </>
  );
}
