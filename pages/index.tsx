import { Stack } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useState } from "react";
import BottomInfo from "../components/BottomInfo";
import FeatureInfo from "../components/FeatureInfo";
import Header from "../components/header/Header";
import Map from "../components/Map";
import Menu from "../components/menu/Menu";
import React from "react";

const Home = () => {
  const [clickedFeature, setClickedFeature] = useState(null);
  const isMediaQuery = useMediaQuery("(max-width:600px)");

  return (
    <Stack sx={{ height: "100vh", width: "100vw", overflow: "hidden" }}>
      <Header />
      <div style={{ height: "100%", position: "relative" }}>
        <Menu isMediaQuery={isMediaQuery} />
        <Map setClickedFeature={setClickedFeature} />
        <FeatureInfo
          clickedFeature={clickedFeature}
          setClickedFeature={setClickedFeature}
          isMediaQuery={isMediaQuery}
        />
        <BottomInfo />
      </div>
    </Stack>
  );
};

export default React.memo(Home);
