import React, { useState } from "react";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

import ViewStateInfo from "../components/ViewStateInfo";
import FeatureInfo from "../components/FeatureInfo";
import Header from "../components/header/Header";
import Map from "../components/Map";
import Menu from "../components/menu/Menu";

const Home = () => {
  const [clickedFeature, setClickedFeature] = useState(null);

  return (
    <Stack sx={{ height: "100vh", width: "100vw" }}>
      <Header />
      <Box height="100%" position="relative">
        <Menu />
        <Map setClickedFeature={setClickedFeature} />
        <FeatureInfo
          clickedFeature={clickedFeature}
          setClickedFeature={setClickedFeature}
        />
        <ViewStateInfo />
      </Box>
    </Stack>
  );
};

export default React.memo(Home);
