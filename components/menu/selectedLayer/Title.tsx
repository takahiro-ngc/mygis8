import HistoryIcon from "@mui/icons-material/History";
import PopoverButton from "../PopoverButton";
import { Typography } from "@mui/material";
import Histry from "./Histry";

export default function Title({ layers, addLayer, storedHistry, setHistry }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "8px 8px 4px 16px",
        justifyContent: "space-between",
      }}
    >
      <Typography variant="h6" component="h2" display="inline">
        選択中のデータ
      </Typography>

      <PopoverButton
        icon={<HistoryIcon />}
        style={{ width: "fit-content", minWidth: "200px" }}
      >
        <Histry
          layers={layers}
          storedHistry={storedHistry}
          addLayer={addLayer}
          setHistry={setHistry}
        />
      </PopoverButton>
    </div>
  );
}
