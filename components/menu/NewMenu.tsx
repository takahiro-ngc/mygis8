import React, { useState, useCallback } from "react";
import { Resizable } from "re-resizable";
import { findLayer } from "../layer/layerList";
import Drawer from "@mui/material/Drawer";
import MenuIcon from "@mui/icons-material/Menu";
import Button from "@mui/material/Button";
import Fade from "@mui/material/Fade";
import Slide from "@mui/material/Slide";
import DataCatalog from "./DataCatalog";
import SelectedLayerList from "./selectedLayer/SelectedLayerList";
import useLocalStorage from "../useLocalStorage";
import { unique } from "../utility";
import FeatureTable from "./selectedLayer/FeatureTable";

export const NewMenu = ({
  layers,
  setLayers,
  setViewState,
  isMainView,
  isDoubleView,
  loadedData,
  isMenuVisible,
  setIsMenuVisible,
}) => {
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

  const [isButtonVisible, setIsButtonVisible] = useState(!isMenuVisible);
  return (
    <>
      {/* メニューボタン */}
      <Button
        variant="contained"
        style={{ position: "absolute", width: 200, left: 400, zIndex: 100 }}
        onClick={() => setIsMenuVisible((prev) => !prev)}
      >
        aaa
      </Button>
      {/* メニュー */}
      <Drawer
        sx={{
          width: 300,
          flexShrink: 0,
          border: "3px blue solid",
        }}
        variant="persistent"
        anchor="left"
        open={isMenuVisible}
        className="acrylic-color menu"
      >
        {/* <div > */}
        <DataCatalog
          addLayer={addLayer}
          deleteLayer={deleteLayer}
          layers={layers}
          setViewState={setViewState}
          setIsMenuVisible={setIsMenuVisible}
          isMainView={isMainView}
        />

        <Resizable
          defaultSize={{
            width: "100%",
            height: 180,
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
        {/* </div> */}
      </Drawer>
      <style jsx>
        {`
          .menu {
             {
              /* width: ${isDoubleView ? "20%" : "35%"};
            max-width: 420px;
            min-width: 260px;
            height: 100%; */
            }
            display: flex;
            flex-direction: column;
            margin-left: ${!isMainView && "auto"};
          }
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
    </>
  );
};

export default React.memo(NewMenu);
