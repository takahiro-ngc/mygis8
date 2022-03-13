import React, { useState } from "react";

import PlaceIcon from "@mui/icons-material/Place";
import { IconButton, Typography } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridSelectionModel,
  GridToolbar,
} from "@mui/x-data-grid";

import { useLayers } from "../../../hooks/useLayers";
import useViewState from "../../../hooks/useViewState";
import { getCenterPosition, roundToSix } from "../../utils/utility";
import { CustomPagination, CustomToolbar } from "./DataGridCompornent";
import renderCellExpand from "./renderCellExpand";

const FeatureTable = ({ layer, index }) => {
  const jump = useViewState((state) => state.jump);

  const isLocalGeojson = layer.data?.type === "FeatureCollection";
  // const test = layer.data?.type.resolve(result);
  const loadedFeature = useLayers((state) => state.loadedFeature[layer.id]);
  // const features = test;
  const features = isLocalGeojson ? layer.data.features : loadedFeature;
  // const features = useLayers((state) => state.loadedFeature[layer.id]);
  const changeLayerProps = useLayers((state) => state.changeLayerProps);

  const keyList = features?.flatMap((d) => Object.keys(d?.properties));
  const uniqueKeyList = Array.from(new Set(keyList));
  const mainColumns: GridColDef[] = uniqueKeyList.map((d) => ({
    field: d,
    headerName: d,
    minWidth: 150,
    renderCell: renderCellExpand,
  }));

  const geometryColumns = [
    {
      field: "geometryType",
      headerName: "geometry type",
      renderCell: renderCellExpand,
    },
    {
      field: "longitude",
      headerName: "中心の経度",
      renderCell: renderCellExpand,
    },
    {
      field: "latitude",
      headerName: "中心の緯度",
      renderCell: renderCellExpand,
    },
  ];
  const indexColumns = {
    field: "id",
    headerName: "Index",
    width: 70,
    //  0が消えてしまうのでrenderCell: renderCellExpandはつけない
  };
  const moveColumns = {
    field: "moveButton",
    headerName: "移動",
    width: 70,
    disableExport: true,
    renderCell: (params) => (
      <IconButton
        size="small"
        onClick={(e) => {
          jump([params.row.longitude, params.row.latitude]);
        }}
      >
        <PlaceIcon />
      </IconButton>
    ),
  };
  const columns = [
    moveColumns,
    indexColumns,
    ...geometryColumns,
    ...mainColumns,
  ];

  const rows = features?.map((d, index) => {
    const geometryType = d.geometry.type;
    const centerPosition = getCenterPosition(d);
    // const coordinates = d.geometry.coordinates;
    const longitude = roundToSix(centerPosition[0]);
    const latitude = roundToSix(centerPosition[1]);

    return {
      id: index,
      geometryType,
      longitude,
      latitude,
      ...d?.properties,
    };
  });

  const [selectionModel, setSelectionModel] = useState<GridSelectionModel>([]);

  return (
    <div>
      <DataGrid
        rows={rows}
        columns={columns}
        disableColumnMenu
        components={{
          Toolbar: GridToolbar,
        }}
        hideFooterSelectedRowCount
        onSelectionModelChange={(newSelectionModel) => {
          setSelectionModel(newSelectionModel);
          changeLayerProps(index, {
            highlightedObjectIndex: newSelectionModel[0],
          });
        }}
        selectionModel={selectionModel}
        style={{ height: "700px", maxHeight: "37vh" }}
        headerHeight={30}
        rowHeight={30}
        onCellFocusOut={() => console.log("bjnkml")}
      />

      <Typography variant="caption">
        ※変換・加工処理をしているため，元データと同一とは限りません。
      </Typography>
    </div>
  );
};

export default React.memo(FeatureTable);
