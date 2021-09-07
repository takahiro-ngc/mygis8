const attribution = {
  attributionName: "G空間情報センター",
  attributionUrl: "https://www.geospatial.jp/ckan/dataset/ksj-cohort",
};

const legendSoujinko =
  "https://www.geospatial.jp/ckan/dataset/9fbf8816-43e4-48f1-b405-7c2c337b31fe/resource/21811c32-7a61-4b59-a954-5844171c2980/download/legendpop.png";

const legendJinkosisu =
  "https://www.geospatial.jp/ckan/dataset/9fbf8816-43e4-48f1-b405-7c2c337b31fe/resource/c02588ff-f35d-4e3d-85a9-9c5076e942af/download/legendindex.png";

const data = [
  {
    id: "1kmメッシュ総人口2010",
    data: "https://tile.geospatial.jp/milt/1km_pop2010/{z}/{x}/{y}.png",
    legendUrl: legendSoujinko,
  },
  {
    id: "1kmメッシュ総人口2025",
    data: "https://tile.geospatial.jp/milt/1km_pop2025/{z}/{x}/{y}.png",
    legendUrl: legendSoujinko,
  },
  {
    id: "1kmメッシュ総人口2040",
    data: "https://tile.geospatial.jp/milt/1km_pop2040/{z}/{x}/{y}.png",
    legendUrl: legendSoujinko,
  },
  {
    id: "1kmメッシュ総人口2050",
    data: "https://tile.geospatial.jp/milt/1km_pop2050/{z}/{x}/{y}.png",
    legendUrl: legendSoujinko,
  },
  {
    id: "1kmメッシュ人口指数2025",
    data: "https://tile.geospatial.jp/milt/index2025/{z}/{x}/{y}.png",
    legendUrl: legendJinkosisu,
  },
  {
    id: "1kmメッシュ人口指数2040",
    data: "https://tile.geospatial.jp/milt/1km_index2040/{z}/{x}/{y}.png",
    legendUrl: legendJinkosisu,
  },
  {
    id: "1kmメッシュ人口指数2050",
    data: "https://tile.geospatial.jp/milt/1km_index2050/{z}/{x}/{y}.png",
    legendUrl: legendJinkosisu,
  },
];

const layerList = data.map((item) => ({
  ...item,
  title: item.id,
  ...attribution,
}));

export const meshPopulationLayers = [
  {
    type: "LayerGroup",
    title: "メッシュ別将来推計人口（H29国政局推計）",
    entries: layerList,
    ...attribution,
  },
];
