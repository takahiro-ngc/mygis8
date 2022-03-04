import { findLayer } from "../components/layer/layerList";
import { addDefaultProps } from "../components/layer/addDefaultProps";
import create from "zustand";
import { jumpSetting } from "../components/utils/utility";

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

export const useLayers = create((set) => {
  const setLoadedFeature = (data) =>
    set((state) => ({
      loadedFeature: { ...state.loadedFeature, ...data },
    }));

  const defaultLayerId1 = "pale";
  const defaultLayerId2 = "OpenStreetMap";
  const defaultLayers = [defaultLayerId1, defaultLayerId2];
  const makeLayerProp = (layerId: string) => {
    const addStoredDataProp = (original) => ({
      ...original,
      onDataLoad: (data) => setLoadedFeature({ [layerId]: data?.features }),
      onViewportLoad: (data) => {
        const features = data.flatMap((d) => d?.content?.features || []);
        setLoadedFeature({ [layerId]: features });
      },
    });
    const layer1 = findLayer(layerId);
    const layer2 = addDefaultProps(layer1);
    const layer3 = addStoredDataProp(layer2);
    return layer3;
  };
  const initialProp = defaultLayers.map((layerId: string) =>
    makeLayerProp(layerId)
  );

  const addLayer = (layerId: string) => {
    const newLayer = makeLayerProp(layerId);
    set((state) => ({ layers: [newLayer, ...state.layers] }));
  };

  const deleteLayer = (layerId: string): void =>
    set((state) => {
      const newLayerList = state.layers.filter((elm) => elm.id !== layerId);
      return { layers: newLayerList };
    });

  const toggleLayer = (layerId: string) =>
    set((state) => {
      const hasSameLayerInPrev = state.layers.some((elm) => elm.id === layerId);
      hasSameLayerInPrev ? deleteLayer(layerId) : addLayer(layerId);
    });

  const setLayers = (newState) =>
    set((state) => {
      console.log("n", newState);
      return { layers: newState };
    });

  const changeLayerProps = (index, newProps) =>
    set((state) => {
      const newLayer = { ...state.layers[index], ...newProps };
      let newLayers = [...state.layers];
      newLayers[index] = newLayer;
      return { layers: newLayers };
    });

  return {
    layers: initialProp,
    addLayer: addLayer,
    loadedFeature: {},
    setLoadedFeature: setLoadedFeature,
    deleteLayer: deleteLayer,
    toggleLayer: toggleLayer,
    setLayers: setLayers,
    changeLayerProps: changeLayerProps,
  };
});
