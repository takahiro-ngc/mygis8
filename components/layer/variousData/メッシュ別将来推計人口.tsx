import { setProps } from "../layerProps";

const srcUrl = "https://www.geospatial.jp/ckan/dataset/ksj-cohort";

const data = [
  {
    id: "1kmメッシュ総人口2010",
    url: "https://tile.geospatial.jp/milt/1km_pop2010/{z}/{x}/{y}.png",
  },
  {
    id: "1kmメッシュ総人口2025",
    url: "https://tile.geospatial.jp/milt/1km_pop2025/{z}/{x}/{y}.png",
  },
  {
    id: "1kmメッシュ総人口2040",
    url: "https://tile.geospatial.jp/milt/1km_pop2040/{z}/{x}/{y}.png",
  },
  {
    id: "1kmメッシュ総人口2050",
    url: "https://tile.geospatial.jp/milt/1km_pop2050/{z}/{x}/{y}.png",
  },
  {
    id: "1kmメッシュ人口指数2025",
    url: "https://tile.geospatial.jp/milt/index2025/{z}/{x}/{y}.png",
  },
  {
    id: "1kmメッシュ人口指数2040",
    url: "https://tile.geospatial.jp/milt/1km_index2040/{z}/{x}/{y}.png",
  },
  {
    id: "1kmメッシュ人口指数2050",
    url: "https://tile.geospatial.jp/milt/1km_index2050/{z}/{x}/{y}.png",
  },
];

const layerList = data.map((item) => ({
  ...setProps(item.url),
  id: item.id,
  title: item.id,
  html: srcUrl,
}));

export const meshPopulationLayers = [
  {
    type: "LayerGroup",
    title: "メッシュ別将来推計人口（H29国政局推計）",
    entries: layerList,
  },
];
