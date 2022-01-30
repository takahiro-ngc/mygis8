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

// ToDo const mergePropToTree= (tree,prop)=>
const setCategory = (list, category = []) => {
  // list.forEach(
  //   (d) => d.entries && setCategory(d.entries, [...category, d.title])
  // );
  return list.map((d) => ({
    ...d,
    category: category,
    entries: d.entries && setCategory(d.entries, [...category, d.title]),
  }));
};

export const layerList = setCategory(layers);
const flattenTree = (tree) =>
  tree.flatMap((d) => (d.entries ? flattenTree(d.entries) : d));
export const flatLayerList = flattenTree(layerList);
export const findLayer = (layerId, targetList = layerList) =>
  // targetList
  //   ? targetList.find(
  //       (obj) => obj.id === layerId || findLayer(layerId, obj.entries)
  //     )
  //   : null;
  flattenTree(layerList).find((obj) => obj.id === layerId);

// 重複
// const idList = flattenTree(layerList).map((d) => d.id);
// const Duplicate = Array.from(new Set(idList));
// console.log("idList", idList);
// console.log("Duplicate", Duplicate);
