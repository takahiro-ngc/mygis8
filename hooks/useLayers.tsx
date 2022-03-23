import { findLayer } from "../components/layer/layerList";
import { addDefaultProps } from "../components/layer/addDefaultProps";
import create from "zustand";

export const useLayers = create((set, get) => {
  const setLoadedFeature = (data) =>
    set((state) => ({
      loadedFeature: { ...state.loadedFeature, ...data },
    }));

  const addStoredDataProp = (currentProps) => ({
    ...currentProps,
    onDataLoad: (data) => {
      console.log(data);
      setLoadedFeature({ [currentProps.id]: data?.features });
    },
    onViewportLoad: (data) => {
      console.log(data);
      const features = data.flatMap(
        (d) => d?.content?.features || d?.content || []
        // (d) => d?.content?.features || d?.content || []
      );
      setLoadedFeature({ [currentProps.id]: features });
    },
  });
  const addLayerProps = (layer) => {
    const layer1 = addDefaultProps(layer);
    const layer2 = addStoredDataProp(layer1);
    return layer2;
  };

  const addLayer = (layerId: string) => {
    const newLayer = addLayerProps(findLayer(layerId));
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

  const setLayers = (layers) => {
    const newLayers = layers.map((layer) => addLayerProps(layer));
    set({ layers: newLayers });
  };

  const changeLayerProps = (indexOrId, newProps) =>
    set((state) => {
      const findLayerIndex = (layerId) =>
        state.layers.findIndex((layer) => layer.id === layerId);
      const index =
        typeof indexOrId === "string" ? findLayerIndex(indexOrId) : indexOrId;
      const newLayer = { ...state.layers[index], ...newProps };
      let newLayers = [...state.layers];
      newLayers[index] = newLayer;
      return { layers: newLayers };
    });
  const defaultLayerId1 = "experimental_anno";
  const defaultLayerId2 = "pale";
  const defaultLayerIds = [defaultLayerId1, defaultLayerId2];
  const defaultLayers = defaultLayerIds.map((layerId) => findLayer(layerId));
  const layers = defaultLayers.map((layer) => addLayerProps(layer));
  // const changeLayerProps = (index, newProps) =>
  // set((state) => {
  //   const newLayer = { ...state.layers[index], ...newProps };
  //   let newLayers = [...state.layers];
  //   newLayers[index] = newLayer;
  //   return { layers: newLayers };
  // });

  return {
    layers,
    addLayer,
    loadedFeature: {},
    setLoadedFeature,
    deleteLayer,
    toggleLayer,
    setLayers,
    changeLayerProps,
  };
});
