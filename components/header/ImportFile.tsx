import Button from "@mui/material/Button";

import Typography from "@mui/material/Typography";
import { KMLLoader } from "@loaders.gl/kml";
import { load } from "@loaders.gl/core";

// import { ShapefileLoader, DBFLoader, SHPLoader } from "../../shapefile/src";
import { useLayers } from "../../hooks/useLayers";
import { addDefaultProps } from "../layer/addDefaultProps";
import shp from "shpjs";

const getFileType = (fileName) => {
  const pos = fileName.lastIndexOf(".");
  return fileName.slice(pos + 1).toLowerCase();
};
const shpToGeojson = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const geojson = await shp(arrayBuffer);
  return geojson;
};

export default function ImportFile() {
  const layers = useLayers((state) => state.layers);
  const setLayers = useLayers((state) => state.setLayers);

  const readFile = async (e) => {
    try {
      const [fileHandle] = await window.showOpenFilePicker();
      const file = await fileHandle.getFile();
      const fileType = getFileType(file.name);
      const data =
        fileType === "zip" ? shpToGeojson(file) : load(file, [KMLLoader]);
      const newLayerProps = {
        data: data,
        id: file.name,
        title: file.name,
      };
      const newLayer = addDefaultProps(newLayerProps);
      setLayers([newLayer, ...layers]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Typography variant="h5" component="h1" style={{ marginBottom: 8 }}>
        ファイルを読込
      </Typography>
      <Typography variant="body1" component="p" marginBottom={1}>
        読込できるファイル：シェープファイル（zip）、json、geojson、kml
      </Typography>
      <Button
        variant="contained"
        component="label"
        size="small"
        color="primary"
        onClick={readFile}
      >
        ファイルを選択
      </Button>
    </>
  );
}
