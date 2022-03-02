import {
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  useGridSlotComponentProps,
} from "@mui/x-data-grid";
import Pagination from "@mui/material/Pagination";
import { Button } from "@mui/material";
import { Typography } from "@mui/material";
import PopoverButton from "../../commonUI/PopoverButton";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";

export const CustomPagination = ({ setViewState }) => {
  const jump = (lng, lat, zoom) =>
    setViewState((prev) => ({
      ...prev,
      longitude: lng,
      latitude: lat,
      zoom: zoom,
      // ...jumpSetting,
    }));

  const { state, apiRef } = useGridSlotComponentProps();
  return (
    <div
      style={{ display: "flex", justifyContent: "space-between", margin: 8 }}
    >
      <Button size="small" variant="outlined" onClick={() => jump(1, 1, 8)}>
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

export const CustomToolbar = () => (
  <GridToolbarContainer>
    <GridToolbarColumnsButton />
    <GridToolbarFilterButton />
    <GridToolbarExport csvOptions={{ allColumns: true }} />
    <PopoverButton icon={<ErrorOutlineOutlinedIcon />}>
      <Typography>
        タイルデータの場合，表に表示できるのは，画面内の地物のみです。
      </Typography>
    </PopoverButton>
  </GridToolbarContainer>
);
