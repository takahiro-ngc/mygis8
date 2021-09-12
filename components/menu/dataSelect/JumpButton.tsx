import { FlyToInterpolator } from "deck.gl";
import IconButton from "@material-ui/core/IconButton";
import FlightTakeoffIcon from "@material-ui/icons/FlightTakeoff";
import { jumpSetting } from "../../utility";

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
