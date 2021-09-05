import { FlyToInterpolator } from "deck.gl";
import IconButton from "@material-ui/core/IconButton";
import FlightTakeoffIcon from "@material-ui/icons/FlightTakeoff";

const JumpButton = ({ addLayer, setViewState, node }) => {
  const jump = (lng, lat, zoom) =>
    setViewState((prev) => ({
      ...prev,
      longitude: lng,
      latitude: lat,
      zoom: zoom,
      transitionDuration: "auto",
      transitionInterpolator: new FlyToInterpolator(),
      transitionEasing: (x) =>
        x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2, //easeInOutQuad
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
