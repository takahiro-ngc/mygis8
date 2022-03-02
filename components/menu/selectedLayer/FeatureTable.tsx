import React, { useState } from "react";

import {
  DataGrid,
  GridColDef,
  GridToolbar,
  GridSelectionModel,
} from "@mui/x-data-grid";
import renderCellExpand from "./renderCellExpand";
import { getCenterPosition } from "../../utils/utility";
import { jumpSetting } from "../../utils/utility";
import { CustomToolbar, CustomPagination } from "./DataGridCompornent";
import { Typography } from "@mui/material";
import { Button } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import PlaceIcon from "@mui/icons-material/Place";
import { IconButton } from "@mui/material";
import { roundToSix } from "../../utils/utility";
import { useViewState } from "../../../hooks/useLayers";

const FeatureTable = ({ features, setViewState, index, changeLayerProps }) => {
  const jump = useViewState((state) => state.jump);
  // const jump = (position) => {
  //   console.log(position);
  //   setViewState((prev) => ({
  //     ...prev,
  //     longitude: position[0],
  //     latitude: position[1],
  //     ...jumpSetting,
  //   }));
  // };

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
      headerName: "経度",
      renderCell: renderCellExpand,
    },
    {
      field: "latitude",
      headerName: "緯度",
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
    const coordinates = d.geometry.coordinates;
    const longitude = roundToSix(centerPosition[0]);
    // geometryType === "Point" ? coordinates[0] : coordinates[0][0];
    const latitude = roundToSix(centerPosition[1]);
    // geometryType === "Point" ? coordinates[1] : coordinates[0][1];

    return {
      id: index,
      geometryType,
      longitude,
      latitude,
      ...d?.properties,
    };
  });

  const [selectionModel, setSelectionModel] = useState<GridSelectionModel>([]);
  // const selectedFeature = features[selectionModel[0]];
  // const position = getCenterPosition(selectedFeature);
  // const jump = () =>
  //   position.length &&
  //   setViewState((prev) => ({
  //     ...prev,
  //     longitude: position[0],
  //     latitude: position[1],
  //     ...jumpSetting,
  //   }));

  const Footer = () => <CustomPagination setViewState={setViewState} />;
  return (
    <>
      {columns.length && (
        <DataGrid
          rows={rows}
          columns={columns}
          disableColumnMenu
          components={{
            Toolbar: GridToolbar,
            // Toolbar: CustomToolbar,
            // Footer: Footer,
          }}
          hideFooterSelectedRowCount
          onSelectionModelChange={(newSelectionModel) => {
            setSelectionModel(newSelectionModel);
            changeLayerProps(index, {
              highlightedObjectIndex: newSelectionModel[0],
            });
          }}
          selectionModel={selectionModel}
          style={{ height: "700px", maxHeight: "35vh" }}
          headerHeight={32}
          rowHeight={32}
        />
      )}
      <Typography variant="subtitle2">
        ※変換・加工処理をしているため，元データの完全な再現とは限りません。
      </Typography>
    </>
  );
};

export default React.memo(FeatureTable);
