import React, { useState, useCallback } from "react";
import { Resizable } from "re-resizable";
import { findLayer } from "../layer/layerList";

import MenuIcon from "@mui/icons-material/Menu";
import Button from "@mui/material/Button";
import Fade from "@mui/material/Fade";
import Slide from "@mui/material/Slide";
import DataCatalog from "./DataCatalog";
import SelectedLayerList from "./selectedLayer/SelectedLayerList";
import useLocalStorage from "../useLocalStorage";
import { unique } from "../utility";
import FeatureTable from "./selectedLayer/FeatureTable";

export const Menu = ({
  layers,
  setLayers,
  setViewState,

  loadedData,
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

  const [isMenuVisible, setIsMenuVisible] = useState(true);
  const handleMenuVisible = () => setIsMenuVisible(!isMenuVisible);
  return (
    <>
      <div
        className="acrylic-color"
        style={{
          marginLeft: isMenuVisible ? 0 : -300,
          transition: "all 230ms ease-in-out",
          zIndex: 1,
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handleMenuVisible}
          style={{
            position: "absolute",
            top: 8,
            right: 0,
            transform: "translate(100%)",
            borderRadius: "0px 6px 6px 0px",
            height: "32px",
            backgroundColor: "black",
            width: 16,
          }}
        ></Button>
        <DataCatalog
          addLayer={addLayer}
          deleteLayer={deleteLayer}
          layers={layers}
          setViewState={setViewState}
          setIsMenuVisible={setIsMenuVisible}
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
      </div>

      <style jsx>
        {`
          .menu {
            width: 35%;
            max-width: 420px;
            min-width: 260px;
            height: 100%;
            display: flex;
            flex-direction: column;

            z-index: 1;
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

export default React.memo(Menu);
