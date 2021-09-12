import React, { useState } from "react";

import {
  GridSelectionModel,
  useGridSlotComponentProps,
} from "@mui/x-data-grid";
import Pagination from "@material-ui/lab/Pagination";
import renderCellExpand from "./renderCellExpand";
import * as turf from "@turf/turf";

export const TableFooter = () => {
  //   const [selectionModel, setSelectionModel] = useState<GridSelectionModel>([]);
  //   const selectedFeature = features[selectionModel[0]];
  //   console.log(selectionModel);
  //   console.log(selectedFeature);

  // 中心座標を求める方法は，https://observablehq.com/@pessimistress/deck-gl-custom-layer-tutorial
  // のgetLabelAnchorsを参考にし，さらにcase "LineString"を追加
  const getPosition = (feature) => {
    const { type, coordinates } = feature.geometry;
    console.log(type, coordinates);
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

  const { state, apiRef } = useGridSlotComponentProps();

  return (
    <Pagination
      color="primary"
      count={state.pagination.pageCount}
      page={state.pagination.page + 1}
      onChange={(event, value) => apiRef.current.setPage(value - 1)}
      style={{ margin: 8 }}
    />
  );
};

export default React.memo(TableFooter);
