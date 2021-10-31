import { Box } from "@mui/system";

export default function BottomInfo({ viewState }) {
  return (
    <Box
      sx={{
        backgroundColor: "background.default",
        position: "absolute",
        bottom: 0,
        right: 0,
        zIndex: 1,
        padding: 4,
      }}
    >
      zoom={viewState.zoom.toFixed(0)}
    </Box>
  );
}
