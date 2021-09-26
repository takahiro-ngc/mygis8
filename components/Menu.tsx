import React, { useState, useCallback } from "react";
import { Resizable } from "re-resizable";
import { findLayer } from "./layer/layerList";
import { Box } from "@mui/system";
import DataCatalog from "./menu/DataCatalog";
import SelectedLayerList from "./menu/selectedLayer/SelectedLayerList";
import useLocalStorage from "./utils/useLocalStorage";
import { unique } from "./utils/utility";

import MenuButton from "./menu/MenuButton";
export const Menu = ({ layers, setLayers, setViewState, loadedData }) => {
  const [storedHistry, setHistry] = useLocalStorage("histry", []);
  const addHistry = (id) =>
    setHistry((prev) => {
      let uniqueList = unique([id, ...prev]);
      uniqueList.length > 10 && uniqueList.pop();
      return uniqueList;
    });

  const addLayer = useCallback(
    (id) => {
      setLayers([findLayer(id), ...layers]);
      addHistry(id);
    },
    [layers]
  );

  const deleteLayer = useCallback(
    (id) => setLayers(layers.filter((elm) => elm.id !== id)),
    [layers]
  );

  const [isMenuVisible, setIsMenuVisible] = useState(true);
  return (
    <Box
      sx={{
        transform: `${isMenuVisible || "translate(-100%)"}`,
        transition: "all 230ms ease-in-out",
        zIndex: 1,
        position: "absolute",
        height: "100%",
        width: "30vw",
        maxWidth: 400,
        display: "flex",
        flexDirection: "column",
        backgroundColor: "background.default",
      }}
    >
      <MenuButton
        isMenuVisible={isMenuVisible}
        setIsMenuVisible={setIsMenuVisible}
      />
      <DataCatalog
        addLayer={addLayer}
        deleteLayer={deleteLayer}
        layers={layers}
        setViewState={setViewState}
      />
      <Resizable
        defaultSize={{
          width: "100%",
          height: 200,
        }}
        minHeight={48}
        enable={{
          top: true,
        }}
        style={{
          borderTop: "1px solid lightgray",
        }}
      >
        <SelectedLayerList
          deleteLayer={deleteLayer}
          layers={layers}
          setLayers={setLayers}
          storedHistry={storedHistry}
          addLayer={addLayer}
          setHistry={setHistry}
          loadedData={loadedData}
          setViewState={setViewState}
        ></SelectedLayerList>
      </Resizable>

      <style jsx>
        {`
          @media screen and (max-width: 700px) {
            .menu {
              width: 100%;
              max-width: 100%;

              height: 800;
              max-height: 60vh;
            }
          }
        `}
      </style>
    </Box>
  );
};

export default React.memo(Menu);
