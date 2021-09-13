import React, { useState } from "react";

import { DataGrid, GridColDef, GridSelectionModel } from "@mui/x-data-grid";
import renderCellExpand from "./renderCellExpand";
import { getCenterPosition } from "../../utility";
import { jumpSetting } from "../../utility";
// import { CustomToolbar, CustomPagination } from "./DataGridCompornent";

const FeatureTable = ({ features, setViewState }) => {
  const keyList = features?.flatMap((d) => Object.keys(d?.properties));
  const uniqueKeyList = Array.from(new Set(keyList));
  const columns: GridColDef[] = uniqueKeyList.map((d) => ({
    field: d,
    headerName: d,
    minWidth: 150,
    renderCell: renderCellExpand,
  }));

  const rows = features?.map((d, index) => ({ id: index, ...d?.properties }));

  const [selectionModel, setSelectionModel] = useState<GridSelectionModel>([]);
  const selectedFeature = features[selectionModel[0]];
  const position = getCenterPosition(selectedFeature);
  const jump = () =>
    position.length &&
    setViewState((prev) => ({
      ...prev,
      longitude: position[0],
      latitude: position[1],
      ...jumpSetting,
    }));

  // const Footer = () => <CustomPagination jump={jump} />;
  return (
    <>
      {columns.length ? (
        <DataGrid
          rows={rows}
          columns={columns}
          disableColumnMenu
          // components={{
          //   Toolbar: CustomToolbar,
          //   Footer: Footer,
          // }}
          onSelectionModelChange={(newSelectionModel) => {
            setSelectionModel(newSelectionModel);
          }}
          selectionModel={selectionModel}
          style={{ height: "700px", maxHeight: "40vh" }}
          headerHeight={32}
          rowHeight={36}
        />
      ) : (
        "このデータは，情報が登録されていないようです。"
      )}
    </>
  );
};

export default React.memo(FeatureTable);
