import { findLayer } from "../components/layer/layerList";
import { addDefaultProps } from "../components/layer/addDefaultProps";
import create from "zustand";
import { makeLayerInstance } from "../components/utils/utility";
import { isEditingCondition } from "../components/utils/utility";
import {
  EditableGeoJsonLayer,
  SelectionLayer,
  ModifyMode,
  ResizeCircleMode,
  TranslateMode,
  TransformMode,
  ScaleMode,
  RotateMode,
  DuplicateMode,
  ExtendLineStringMode,
  SplitPolygonMode,
  ExtrudeMode,
  ElevationMode,
  DrawPointMode,
  DrawLineStringMode,
  DrawPolygonMode,
  DrawRectangleMode,
  DrawSquareMode,
  DrawRectangleFromCenterMode,
  DrawSquareFromCenterMode,
  DrawCircleByDiameterMode,
  DrawCircleFromCenterMode,
  DrawEllipseByBoundingBoxMode,
  DrawEllipseUsingThreePointsMode,
  DrawRectangleUsingThreePointsMode,
  Draw90DegreePolygonMode,
  DrawPolygonByDraggingMode,
  MeasureDistanceMode,
  MeasureAreaMode,
  MeasureAngleMode,
  ViewMode,
  CompositeMode,
  SnappableMode,
  ElevatedEditHandleLayer,
  PathMarkerLayer,
  SELECTION_TYPE,
  GeoJsonEditMode,
} from "nebula.gl";

const mode = {
  ModifyMode,
  ResizeCircleMode,
  TranslateMode,
  TransformMode,
  ScaleMode,
  RotateMode,
  DuplicateMode,
  ExtendLineStringMode,
  SplitPolygonMode,
  ExtrudeMode,
  ElevationMode,
  DrawPointMode,
  DrawLineStringMode,
  DrawPolygonMode,
  MeasureDistanceMode,
  MeasureAreaMode,
  MeasureAngleMode,
  ViewMode,
  CompositeMode,
  SnappableMode,
  ElevatedEditHandleLayer,
  PathMarkerLayer,
  GeoJsonEditMode,
};
export const useLayers = create((set, get) => {
  const setLoadedFeature = (data) =>
    set((state) => ({
      loadedFeature: { ...state.loadedFeature, ...data },
    }));

  const defaultLayerId1 = "experimental_anno";
  const defaultLayerId2 = "pale";
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
  const layers = defaultLayers.map((layerId: string) => makeLayerProp(layerId));

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

  const setLayers = (newState) => set({ layers: newState });

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

  // const changeLayerProps = (index, newProps) =>
  // set((state) => {
  //   const newLayer = { ...state.layers[index], ...newProps };
  //   let newLayers = [...state.layers];
  //   newLayers[index] = newLayer;
  //   return { layers: newLayers };
  // });

  const editableLayer = addDefaultProps({
    layerType: "EditableGeoJsonLayer",
    id: new Date().toLocaleString(),
    data: {
      type: "FeatureCollection",
      features: [],
    },
    mode: DrawPolygonMode,
    selectedFeatureIndexes: [],
    title: new Date().toLocaleString(),
    onEdit: ({ updatedData }) => {
      changeLayerProps(0, {
        data: updatedData,
      });
    },
    autoHighlight: false, //falseにすればあのバグなし
    // updateTriggers: { mode: true },
  });
  const addEditableLayer = () => {
    const id = new Date().toLocaleTimeString() + "の計測・作図";
    set((state) => ({
      layers: [
        {
          ...editableLayer,
          id: id,
          title: id,
          onEdit: ({ updatedData }) =>
            changeLayerProps(id, {
              data: updatedData,
            }),
        },
        ...state.layers,
      ],
    }));
  };
  const ableEdit = (index) => {
    changeLayerProps(index, { mode: DrawPolygonMode, autoHighlight: false });
    // set({ isEditing: true });
  };
  const disableEdit = () => {
    const disableEditProps = (layer) =>
      layer.layerType === "EditableGeoJsonLayer"
        ? {
            ...layer,
            mode: ViewMode,
            autoHighlight: true,
          }
        : layer;

    set((state) => ({
      layers: state.layers.map((layer) => disableEditProps(layer)),
      // isEditing: false,
    }));
  };

  const currentEditLayerIndex = layers.findIndex(
    (layer) =>
      layer.layerType === "EditableGeoJsonLayer" && layer.mode !== ViewMode
  );

  const getIsEditing = () => get().layers.some(isEditingCondition);

  return {
    layers,
    getIsEditing,

    ableEdit,
    disableEdit,
    addLayer,
    loadedFeature: {},
    setLoadedFeature,
    deleteLayer,
    toggleLayer,
    setLayers,
    changeLayerProps,
    addEditableLayer,
  };
});
