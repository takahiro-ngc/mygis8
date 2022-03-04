import React, { useState } from "react";

import {
  DataGrid,
  GridColDef,
  GridToolbar,
  GridSelectionModel,
} from "@mui/x-data-grid";
import renderCellExpand from "./renderCellExpand";
import { getCenterPosition } from "../../utils/utility";
import { CustomToolbar, CustomPagination } from "./DataGridCompornent";
import { Typography } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import PlaceIcon from "@mui/icons-material/Place";
import { IconButton } from "@mui/material";
import { roundToSix } from "../../utils/utility";
import { useViewState } from "../../../hooks/useLayers";
import { useLayers } from "../../../hooks/useLayers";
import { ClickAwayListener } from "@mui/material";

const FeatureTable = ({ layer, index }) => {
  const jump = useViewState((state) => state.jump);
  const features = useLayers((state) => state.loadedFeature[layer.id]);
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
  const handleClickAway = () =>
    changeLayerProps(index, {
      highlightedObjectIndex: null,
    });
  return (
    // <ClickAwayListener onClickAway={() => console.log("tyvbuinm")}>
    // {/* ClickAwayListenerは<>は不可 */}
    <div>
      {/* {columns.length && (
        <> */}
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
        ※変換・加工処理をしているため，元データの完全な再現とは限りません。
      </Typography>
      {/* <button onClick={handleClickAway}>aaa</button> */}
      {/* </>
      )} */}
    </div>
    // </ClickAwayListener>
  );
};

export default React.memo(FeatureTable);
