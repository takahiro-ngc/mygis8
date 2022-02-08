import { useReducer } from "react";
import { findLayer } from "../components/layer/layerList";
import { addDefaultProps } from "../components/layer/addDefaultProps";

type Action = {
  type: "toggle" | "import" | "set";
  layer: string | object;
};

const reducer = (prev, action: Action) => {
  switch (action.type) {
    case "toggle":
      const layerId = action.layer;
      const newLayer = findLayer(layerId);
      const newLayerwithProps = addDefaultProps(newLayer);
      console.log("selectedLayer", layerId, newLayer);

      const hasSameLayerInPrev = prev.some((elm) => elm.id === layerId);
      const withNewLayer = [newLayerwithProps, ...prev];
      const withoutNewLayer = prev.filter((elm) => elm.id !== layerId);

      const result = hasSameLayerInPrev ? withoutNewLayer : withNewLayer;
      return hasSameLayerInPrev ? withoutNewLayer : withNewLayer;
    // return result.map((item) => new TileLayer(item));

    case "set":
      // ToDo
      console.log(action.layer);
      return action.layer;

    case "import":
      // ToDo
      return [];
  }
};

export const useLayers = (initialState = []) => {
  const initialLayers = initialState.map((layerId) => findLayer(layerId));
  const initialLayerswithProps = initialLayers.map((layer) =>
    addDefaultProps(layer)
  );
  // return useReducer(reducer, []);
  return useReducer(reducer, initialLayerswithProps);
};
