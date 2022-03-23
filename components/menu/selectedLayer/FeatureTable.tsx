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
import { getCenterPosition, unique, getFileType } from "../../utils/utility";
import renderCellExpand from "./renderCellExpand";

const FeatureTable = ({ layer, index }) => {
  const { jump } = useViewState();
  const isMapboxFile =
    getFileType(layer.data) === "pbf" || getFileType(layer.data) === "mvt";

  const loadedFeature = useLayers((state) => state.loadedFeature[layer.id]);
  const features = loadedFeature;
  // const features = isDirectData ? layer.data.features : loadedFeature;

  const keyList = features?.flatMap((d) => Object.keys(d?.properties));
  const uniqueKeyList = unique(keyList);
  const mainColumns: GridColDef[] = uniqueKeyList.map((d) => ({
    field: d,
    headerName: d,
    minWidth: 150,
    renderCell: renderCellExpand,
  }));

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
          const centerPosition = getCenterPosition(features[params.id]);
          jump(centerPosition);
          console.log(params);
          console.log(centerPosition);
        }}
      >
        <PlaceIcon />
      </IconButton>
    ),
  };

  // pbfファイルから取得する座標は、基準座標からの相対座標になるようで、絶対座標への変換方法が不明のため、一部項目を除外
  const columns = isMapboxFile
    ? [indexColumns, ...mainColumns]
    : [moveColumns, indexColumns, ...mainColumns];

  const rows = features?.map((d, index) => {
    return {
      id: index,
      ...d?.properties,
    };
  });

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
        style={{ height: "700px", maxHeight: "37vh" }}
        headerHeight={30}
        rowHeight={30}
      />

      <Typography variant="caption">
        ※変換・加工処理をしているため，元データと同一とは限りません。
      </Typography>
    </div>
  );
};

export default React.memo(FeatureTable);
