import { Button } from "@material-ui/core";
import {
  ViewMode,
  DrawPointMode,
  DrawLineStringMode,
  DrawPolygonMode,
  DrawPolygonByDraggingMode,
  DrawRectangleUsingThreePointsMode,
  DrawCircleFromCenterMode,
  MeasureDistanceMode,
  MeasureAreaMode,
} from "@nebula.gl/edit-modes";

export const defaultMode = [
  { id: "ViewMode", text: "終了", handler: ViewMode },
];

const measureMode = [
  {
    id: "MeasureDistanceMode",
    text: "距離",
    handler: MeasureDistanceMode,
  },
  { id: "MeasureAreaMode", text: "面積", handler: MeasureAreaMode },
];

export const drawMode = [
  { id: "DrawPointMode", text: "点", handler: DrawPointMode },
  { id: "DrawLineStringMode", text: "線", handler: DrawLineStringMode },
  { id: "DrawPolygonMode", text: "面", handler: DrawPolygonMode },
  {
    id: "DrawPolygonByDraggingMode",
    text: "フリーハンド",
    handler: DrawPolygonByDraggingMode,
  },
  {
    id: "DrawRectangleUsingThreePointsMode",
    text: "四角形",
    handler: DrawRectangleUsingThreePointsMode,
  },
  {
    id: "DrawCircleFromCenterMode",
    text: "円",
    handler: DrawCircleFromCenterMode,
  },
];

const EditMode = ({ modeOfEdit, setModeOfEdit }) => {
  const ButtonGroup = ({ list }) =>
    list.map((item) => (
      <Button
        size="small"
        variant="contained"
        onClick={() => setModeOfEdit(item)}
        style={{ marginBottom: 8 }}
        color={item.id === modeOfEdit.id ? "primary" : "default"}
      >
        {item.text}
      </Button>
    ));
  const spacer = <div style={{ margin: 8 }}></div>;

  return (
    <div
      style={{
        position: "absolute",
        margin: 8,
        right: 0,
        display: "flex",
        flexDirection: "column",
        // gap: 16,
      }}
    >
      <ButtonGroup list={defaultMode} />
      {spacer}
      <ButtonGroup list={measureMode} />
      {spacer}
      <ButtonGroup list={drawMode} />
    </div>
  );
};
export default EditMode;
