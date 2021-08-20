import { gsiLayers } from "./gsi/gsiLayers";
import { OSMLayers } from "./variousData/OpenStreetMap";
import { meshPopulationLayers } from "./variousData/メッシュ別将来推計人口";
import { noukenLayers } from "./variousData/農研機構";
import { otherLayers } from "./variousData/temporary";

export const layerList = [
  ...gsiLayers,
  ...OSMLayers,
  ...meshPopulationLayers,
  ...noukenLayers,
  ...otherLayers,
];

const flattenTree = (tree) =>
  tree.flatMap((d) => (d.entries ? flattenTree(d.entries) : d));

export const findLayer = (layerId: string) =>
  flattenTree(layerList).find((obj) => obj.id === layerId);
