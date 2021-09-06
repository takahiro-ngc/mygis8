import { Button } from "@material-ui/core";
import {
  ViewMode,
  DrawPointMode,
  DrawLineStringMode,
  DrawPolygonMode,
  DrawPolygonByDraggingMode,
  DrawRectangleUsingThreePointsMode,
  DrawCircleFromCenterMode,
  ModifyMode,
  MeasureDistanceMode,
  MeasureAreaMode,
} from "@nebula.gl/edit-modes";

const modeList = [
  { text: "作図・計測の終了", handler: ViewMode },
  { text: "点を描く", handler: DrawPointMode },
  { text: "線を描く", handler: DrawLineStringMode },
  { text: "面を描く", handler: DrawPolygonMode },
  { text: "ドラッグで面を描く", handler: DrawPolygonByDraggingMode },
  {
    text: "四角形を描く",
    handler: DrawRectangleUsingThreePointsMode,
  },
  { text: "円を描く", handler: DrawCircleFromCenterMode },
  { text: "図の修正・削除", handler: ModifyMode },
  { text: "距離を計測", handler: MeasureDistanceMode },
  { text: "面積を計測", handler: MeasureAreaMode },
];
const EditMode = ({ setModeOfEdit }) => (
  <div
    style={{
      position: "absolute",
      top: 48,
      right: "8px",
      display: "flex",
      flexDirection: "column",
      zIndex: 1000,
      gap: 8,
    }}
  >
    {modeList.map((d, index) => (
      <Button size="small" variant="contained" onClick={() => setModeOfEdit(d)}>
        {d.text}
      </Button>
    ))}
  </div>
);
export default EditMode;
