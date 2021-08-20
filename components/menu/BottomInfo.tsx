import { Typography } from "@material-ui/core";

export default function BottomInfo({ viewState }) {
  return (
    <div
      className="acrylic-color"
      style={{
        position: "absolute",
        bottom: 0,
        right: 0,
        zIndex: 1,
        padding: 4,
      }}
    >
      zoom={viewState.zoom.toFixed(0)}
    </div>
  );
}
