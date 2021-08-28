import { gsiLayers } from "./gsi/gsiLayers";
import { OSMLayers } from "./variousData/OpenStreetMap";
import { meshPopulationLayers } from "./variousData/メッシュ別将来推計人口";
import { noukenLayers } from "./variousData/農研機構";
import { otherLayers } from "./variousData/temporary";

const layers = [
  ...gsiLayers,
  ...OSMLayers,
  ...meshPopulationLayers,
  ...noukenLayers,
  ...otherLayers,
];

const setCategory = (list, category = []) =>
  list.map((d) => ({
    ...d,
    category: category,
    entries: d.entries && setCategory(d.entries, [...category, d.title]),
  }));

export const layerList = setCategory(layers);
console.log(layerList);
const flattenTree = (tree) =>
  tree.flatMap((d) => (d.entries ? flattenTree(d.entries) : d));

export const findLayer = (layerId, targetList = layerList) =>
  // targetList
  //   ? targetList.find(
  //       (obj) => obj.id === layerId || findLayer(layerId, obj.entries)
  //     )
  //   : null;
  flattenTree(layerList).find((obj) => obj.id === layerId);
