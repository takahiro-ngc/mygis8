import React, { useState } from "react";

import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridSelectionModel,
  useGridSlotComponentProps,
} from "@mui/x-data-grid";
import Pagination from "@material-ui/lab/Pagination";
import renderCellExpand from "./renderCellExpand";
import * as turf from "@turf/turf";
import Tablefooter from "./TableFooter";
import { Button } from "@material-ui/core";
import { FlyToInterpolator } from "deck.gl";
import { Typography } from "@material-ui/core";
import PopoverButton from "../PopoverButton";
import ErrorOutlineOutlinedIcon from "@material-ui/icons/ErrorOutlineOutlined";

export const FeatureTable = ({ features, setViewState }) => {
  const keyList = Object.keys(features?.[0].properties || {});
  const columns: GridColDef[] = keyList.map((d) => ({
    field: d,
    headerName: d,
    minWidth: 150,
    renderCell: renderCellExpand,
  }));

  const rows = features?.map((d, index) => ({ id: index, ...d?.properties }));
  const CustomToolbar = () => (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarExport csvOptions={{ allColumns: true }} />
      <PopoverButton icon={<ErrorOutlineOutlinedIcon />}>
        <Typography>
          ・この表は，元データからの簡易変換のため，完全な再現とは限りません。
          <br />
          ・タイルデータの場合，表に表示できるのは，画面内の地物のみです。
        </Typography>
      </PopoverButton>
    </GridToolbarContainer>
  );

  const [selectionModel, setSelectionModel] = useState<GridSelectionModel>([]);
  const selectedFeature = features[selectionModel[0]];
  console.log(selectionModel);
  console.log(selectedFeature);

  // 中心座標を求める方法は，https://observablehq.com/@pessimistress/deck-gl-custom-layer-tutorial
  // のgetLabelAnchorsを参考にし，さらにcase "LineString"を追加
  const getPosition = (feature) => {
    const type = feature?.geometry?.type;
    const coordinates = feature?.geometry?.coordinates;

    switch (type) {
      case "Point":
        return [coordinates];
      case "MultiPoint":
        return coordinates;
      case "Polygon":
        return [turf.centerOfMass(feature).geometry.coordinates];
      case "LineString":
        return [turf.centerOfMass(feature).geometry.coordinates];
      case "MultiPolygon":
        let polygons = coordinates.map((rings) => turf.polygon(rings));
        const areas = polygons.map(turf.area);
        const maxArea = Math.max.apply(null, areas);
        // Filter out the areas that are too small
        return polygons
          .filter((f, index) => areas[index] > maxArea * 0.5)
          .map((f) => turf.centerOfMass(f).geometry.coordinates);
      default:
        return [];
    }
  };
  const position = getPosition(selectedFeature).flat();
  const jump = (lng, lat) =>
    lng &&
    lat &&
    setViewState((prev) => ({
      ...prev,
      longitude: lng,
      latitude: lat,
      transitionDuration: "auto",
      transitionInterpolator: new FlyToInterpolator(),
      transitionEasing: (x) =>
        x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2, //easeInOutQuad
    }));

  const CustomPagination = () => {
    const { state, apiRef } = useGridSlotComponentProps();
    return (
      <div
        style={{ display: "flex", justifyContent: "space-between", margin: 8 }}
      >
        <Button
          size="small"
          variant="outlined"
          onClick={() => jump(position[0], position[1])}
        >
          選択地点に移動
        </Button>
        <Pagination
          color="primary"
          count={state.pagination.pageCount}
          page={state.pagination.page + 1}
          onChange={(event, value) => apiRef.current.setPage(value - 1)}
          size="small"
        />
      </div>
    );
  };

  return (
    <>
      {features && (
        <DataGrid
          rows={rows}
          columns={columns}
          disableColumnMenu
          components={{
            Toolbar: CustomToolbar,
            Footer: CustomPagination,
          }}
          onSelectionModelChange={(newSelectionModel) => {
            setSelectionModel(newSelectionModel);
          }}
          selectionModel={selectionModel}
          rowHeight={36}
          style={{ height: "700px", maxHeight: "70vh" }}
        />
      )}
    </>
  );
};

export default React.memo(FeatureTable);
