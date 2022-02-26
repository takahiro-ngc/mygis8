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

export const useLayer = (initialLayerIds) => {
  const [storedData, setStoredData] = useState({});

  const makeLayerProp = (layerId: string) => {
    const addStoredDataProp = (original) => ({
      ...original,
      onDataLoad: (data) =>
        setStoredData((prev) => ({ ...prev, [layerId]: data?.features })),
      onViewportLoad: (data) => {
        const features = data.flatMap((d) => d?.content?.features || []);
        setStoredData((prev) => ({ ...prev, [layerId]: features }));
      },
    });
    const layer1 = findLayer(layerId);
    const layer2 = addDefaultProps(layer1);
    const layer3 = addStoredDataProp(layer2);
    return layer3;
  };

  const initialProp = initialLayerIds.map((layerId) => makeLayerProp(layerId));
  const [layerProp, setLayerProp] = useState(initialProp || []);

  const addLayer = (layerId: string) => {
    const newLayer = makeLayerProp(layerId);
    setLayerProp([newLayer, ...layerProp]);
  };

  const deleteLayer = (layerId: string): void => {
    const newLayerList = layerProp.filter((elm) => elm.id !== layerId);
    setLayerProp(newLayerList);
  };

  const toggleLayer = (layerId: string): void => {
    const hasSameLayerInPrev = layerProp.some((elm) => elm.id === layerId);
    hasSameLayerInPrev ? deleteLayer(layerId) : addLayer(layerId);
  };

  const handleLayer = { toggleLayer };
  return [layerProp, storedData, handleLayer];
};
