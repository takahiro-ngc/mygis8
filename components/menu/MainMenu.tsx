import React, { useState } from "react";
import { Resizable } from "re-resizable";
import { findLayer } from "../layer/layerList";

import MenuIcon from "@material-ui/icons/Menu";
import Button from "@material-ui/core/Button";
import Fade from "@material-ui/core/Fade";
import Slide from "@material-ui/core/Slide";
import DataCatalog from "./DataCatalog";
import SelectedLayerList from "./selectedLayer/SelectedLayerList";

export default function MainMenu({ layers, setLayers, setViewState }) {
  const addLayer = (id) => {
    setLayers([findLayer(id), ...layers]);
    // setHistry((prev) => unique([id, ...prev]));
  };

  const deleteLayer = (id) => setLayers(layers.filter((elm) => elm.id !== id));

  const [isMenuVisible, setIsMenuVisible] = useState(true);
  const [isButtonVisible, setIsButtonVisible] = useState(!isMenuVisible);
  return (
    <>
      {/* メニューボタン */}
      <Fade in={isButtonVisible} unmountOnExit exit={false}>
        <div
          style={{
            zIndex: 1,
            margin: 8,
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setIsButtonVisible(false);
              setIsMenuVisible(true);
            }}
          >
            <MenuIcon />
          </Button>
        </div>
      </Fade>

      {/* メニュー */}
      <Slide
        in={isMenuVisible}
        direction="right"
        appear={false} //初期ロード時のtransitionを防ぐ
        onExited={() => setIsButtonVisible(true)}
      >
        <div className="acrylic-color menu">
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
              // storedHistry={storedHistry}
              addLayer={addLayer}
              // setHistry={setHistry}
            ></SelectedLayerList>
          </Resizable>
        </div>
      </Slide>

      <style jsx>
        {`
          .menu {
            z-index: 1;
            width: 40vw;
            max-width: 420px;
            min-width: 350px;
            height: calc(100vh - 48px); //48=headerHeight
            display: flex;
            flex-direction: column;
          }
          @media screen and (max-width: 700px) {
            .menu {
              width: 100vw;
              max-width: 100vw;

              height: 800;
              max-height: 50vh;
            }
          }
        `}
      </style>
    </>
  );
}
