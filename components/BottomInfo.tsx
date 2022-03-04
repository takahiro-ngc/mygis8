import { Box } from "@mui/system";
import { useViewState } from "../hooks/useLayers";

export default function BottomInfo() {
  // const lat = hoverdFeature?.coordinate?.[1].toFixed(6);
  // const lon = hoverdFeature?.coordinate?.[0].toFixed(6);
  const zoom = useViewState((state) => state.zoom).toFixed(0);

  return (
    <Box
      sx={{
        backgroundColor: "background.default",
        position: "absolute",
        bottom: 0,
        right: 0,
        zIndex: 1,
        padding: "2px",
      }}
    >
      {/* {lat && `緯度/経度=${lat} ${lon} `} */}
      zoom={zoom}
    </Box>
  );
}
