import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem, { ListItemProps } from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { Button } from "@material-ui/core";
import {
  ViewMode,
  DrawPointMode,
  DrawLineStringMode,
  DrawPolygonMode,
  DrawPolygonByDraggingMode,
  DrawRectangleUsingThreePointsMode,
  DrawCircleFromCenterMode,
} from "nebula.gl";

const modeList = [
  { text: "ViewMode", handler: ViewMode },
  { text: "DrawPointMode", handler: DrawPointMode },
  { text: "DrawLineStringMode", handler: DrawLineStringMode },
  { text: "DrawPolygonMode", handler: DrawPolygonMode },
  { text: "DrawPolygonByDraggingMode", handler: DrawPolygonByDraggingMode },
  {
    text: "DrawRectangleUsingThreePointsMode",
    handler: DrawRectangleUsingThreePointsMode,
  },
  { text: "DrawCircleFromCenterMode", handler: DrawCircleFromCenterMode },
];
const Edit = ({ setModeOfEdit }) => (
  <>
    {modeList.map((d, index) => (
      <Button color="primary" onClick={() => setModeOfEdit(d)}>
        {d.text}
      </Button>
    ))}
  </>
);
export default Edit;
