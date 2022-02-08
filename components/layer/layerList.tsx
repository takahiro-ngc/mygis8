import { gsiLayers } from "./gsi/gsiLayers";
import { OSMLayers } from "./variousData/OpenStreetMap";
import { otherLayers } from "./variousData/temporary";
import { meshPopulationLayers } from "./variousData/メッシュ別将来推計人口";
import { noukenLayers } from "./variousData/農研機構";

const layers = [
  ...gsiLayers,
  ...OSMLayers,
  ...meshPopulationLayers,
  ...noukenLayers,
  ...otherLayers,
];

const addCategory = (list, category = []) =>
  list.map((d) => ({
    ...d,
    category: category,
    entries: d.entries && addCategory(d.entries, [...category, d.title]),
  }));
export const layerList = addCategory(layers);

const flattenTree = (tree) =>
  tree.flatMap((d) => (d.entries ? flattenTree(d.entries) : d));
export const flatLayerList = flattenTree(layerList);

export const findLayer = (layerId) =>
  flatLayerList.find((obj) => obj.id === layerId);

// 重複
// const idList = flattenTree(layerList).map((d) => d.id);
// const Duplicate = Array.from(new Set(idList));
// console.log("idList", idList);
// console.log("Duplicate", Duplicate);
