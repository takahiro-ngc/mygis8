import { useCallback, useReducer, useState } from "react";
import { findLayer } from "../components/layer/layerList";
import { addDefaultProps } from "../components/layer/addDefaultProps";

type Action = {
  type: "toggle" | "import" | "set";
  layer: string | object;
};

// ToDo
// addLayer
// deleteLayer
// toggleLayer
// changeProp
// toggleProp
// storeDate
// const [layers,storedDate,dispatch]=useLayer

export const useLayer = (initialLayerIds = []) => {
  const initialLayers = initialLayerIds.map((layerId) => findLayer(layerId));
  const initialLayerswithProps = initialLayers.map((layer) =>
    addDefaultProps(layer)
  );

  const [layerProp, setLayerProp] = useState(initialLayerswithProps);
  const [storedData, setStoredData] = useState({});
  const toggleLayer = (layerId: string): void => {
    const newLayer = findLayer(layerId);
    const newLayerwithProps = addDefaultProps(newLayer);

    const testProps = {
      ...newLayerwithProps,
      onDataLoad: (value) => {
        setStoredData((prev) => ({ ...prev, [layerId]: value?.features }));
        console.log({ [layerId]: value?.features });
        // console.log("storedData", storedData);
      },
      onViewportLoad: (data) => {
        const features = data.flatMap((d) => d?.content?.features || []);
        setStoredData((prev) => ({ ...prev, [layerId]: features }));
        console.log({ [layerId]: features });
        // console.log("storedData", storedData);
      },
    };

    const withNewLayer = [testProps, ...layerProp];
    // const withNewLayer = [newLayerwithProps, ...layerProp];

    // console.log("addLayer", layerId, newLayerwithProps);
    const withoutNewLayer = layerProp.filter((elm) => elm.id !== layerId);
    const hasSameLayerInPrev = layerProp.some((elm) => elm.id === layerId);
    setLayerProp(hasSameLayerInPrev ? withoutNewLayer : withNewLayer);
    // console.log(layerProp);
    // console.log(storedData);
  };

  const handleLayer = { toggleLayer };
  return [layerProp, storedData, handleLayer];
};
