import { useCallback, useReducer, useState } from "react";
import { findLayer } from "../components/layer/layerList";
import { addDefaultProps } from "../components/layer/addDefaultProps";

export const useLayers = (initialLayerIds) => {
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

  const initialProp = initialLayerIds.map((layerId: string) =>
    makeLayerProp(layerId)
  );
  const [layers, setLayers] = useState(initialProp || []);

  const addLayer = useCallback(
    (layerId: string) => {
      const newLayer = makeLayerProp(layerId);
      setLayers([newLayer, ...layers]);
    },
    [layers]
  );

  const deleteLayer = useCallback(
    (layerId: string): void => {
      const newLayerList = layers.filter((elm) => elm.id !== layerId);
      setLayers(newLayerList);
    },
    [layers]
  );

  const toggleLayer = useCallback(
    (layerId: string): void => {
      const hasSameLayerInPrev = layers.some((elm) => elm.id === layerId);
      hasSameLayerInPrev ? deleteLayer(layerId) : addLayer(layerId);
    },
    [layers]
  );

  return [layers, storedData, { setLayers, toggleLayer }];
};
