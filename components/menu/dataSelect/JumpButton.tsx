import { FlyToInterpolator } from "deck.gl";
import IconButton from "@mui/material/IconButton";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import { jumpSetting } from "../../utils/utility";

const JumpButton = ({ addLayer, setViewState, node }) => {
  const jump = (lng, lat, zoom) =>
    setViewState((prev) => ({
      ...prev,
      longitude: lng,
      latitude: lat,
      zoom: zoom,
      ...jumpSetting,
    }));

  return (
    <IconButton
      size="small"
      onClick={(e) => {
        e.stopPropagation();
        addLayer(node.id);
        jump(node.area.lng, node.area.lat, node.area.zoom);
      }}
    >
      {<FlightTakeoffIcon />}
    </IconButton>
  );
};

export default JumpButton;
