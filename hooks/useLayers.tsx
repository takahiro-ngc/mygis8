import { useCallback, useReducer, useState } from "react";
import { findLayer } from "../components/layer/layerList";
import { addDefaultProps } from "../components/layer/addDefaultProps";
import create from "zustand";
import { jumpSetting } from "../components/utils/utility";

export const useLayers = (initialLayerIds) => {
  const [storedData, setStoredData] = useState({});

  const makeLayerProp = (layerId: string) => {
    const addStoredDataProp = (original) => ({
      ...original,
      onDataLoad: (data) => {
        setStoredData((prev) => ({ ...prev, [layerId]: data?.features }));
        console.log(data.features);
      },
      onViewportLoad: (data) => {
        const features = data.flatMap((d) => d?.content?.features || []);
        setStoredData((prev) => ({ ...prev, [layerId]: features }));
        console.log(data, features);
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

  const changeLayerProps = useCallback(
    (index, newProps) => {
      const newLayer = { ...layers[index], ...newProps };
      let clone = [...layers];
      clone[index] = newLayer;
      setLayers(clone);
    },
    [layers]
  );

  return [layers, storedData, { setLayers, toggleLayer, changeLayerProps }];
};

export const useViewState = create((set) => ({
  longitude: 139.7673068,
  latitude: 35.6809591,
  bearing: 0,
  zoom: 8,
  minZoom: 0, //遠景
  maxZoom: 17.499, //近景 地理院地図（ラスター）は17.5未満が最大
  maxPitch: 85,
  setViewState: (newState) =>
    set((state) => ({
      ...state,
      ...newState,
    })),
  jump: (position) =>
    set((state) => ({
      ...state,
      longitude: position[0],
      latitude: position[1],
      ...jumpSetting,
    })),
}));

const jump = (position) => {
  console.log(position);
  setViewState((prev) => ({
    ...prev,
    longitude: position[0],
    latitude: position[1],
    ...jumpSetting,
  }));
};
