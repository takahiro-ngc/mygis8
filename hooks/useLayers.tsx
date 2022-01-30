import { useReducer } from "react";
import { findLayer } from "../components/layer/layerList";

type Action = {
  type: "toggle" | "import" | "set";
  layer: string | object;
};

const reducer = (prev, action: Action) => {
  switch (action.type) {
    case "toggle":
      const layerId = action.layer;
      const newLayer = findLayer(layerId);
      console.log("selectedLayer", layerId, newLayer);
      const hasSameLayerInPrev = prev.some((elm) => elm.id === layerId);
      const withNewLayer = [newLayer, ...prev];
      // const withNewLayer = [newLayer, ...prev];
      const withoutNewLayer = prev.filter((elm) => elm.id !== layerId);
      return hasSameLayerInPrev ? withoutNewLayer : withNewLayer;

    case "set":
      // ToDo
      return action.layer;

    case "import":
      // ToDo
      return [];
  }
};

export const useLayers = (initialState = []) =>
  useReducer(reducer, initialState);
