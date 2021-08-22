import { Typography } from "@material-ui/core";
import { Button } from "@material-ui/core/";
import PopoverButton from "../menu/PopoverButton";
import Faq from "./Faq";
import Import from "./Import";

export default function Header({ setLayers }) {
  const buttonProps = { variant: "outlined" };
  return (
    <div
      style={{
        width: "100vw",
        zIndex: 1,
        padding: 8,
        display: "flex",
        boxShadow: "0px 0px 12px 0px rgba(0,0,0,0.5)",
        background: "rgba(0, 0, 0, 0.8)",
        backdropFilter: "blur(5px)",
      }}
    >
      <Typography variant="h5" component="h1">
        色々な地図。
      </Typography>
      <div style={{ display: "flex", gap: 8, marginLeft: "auto" }}>
        <Button variant="outlined" size="small">
          共有
        </Button>
        <PopoverButton buttonLabel="インポート" style={{ width: 800 }}>
          <Import setLayers={setLayers} />
        </PopoverButton>

        <PopoverButton buttonLabel="FAQ" style={{ width: 800 }}>
          <Faq />
        </PopoverButton>
      </div>
    </div>
  );
}
