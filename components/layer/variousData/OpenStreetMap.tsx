// https://qiita.com/nyampire/items/fbe359a2c9ccf0116787
// https://ujicya.jp/blog-mapping/xyz-tiles-url/
// アウトドアとランドスケープ，サイクルは要api;
const data = [
  {
    id: "OpenStreetMap",
    data: "http://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
  },
  {
    id: "OpenStreetMap アウトドア",
    data: "http://a.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png",
  },
  {
    id: "landscape",
    data: "http://a.tile3.opencyclemap.org/landscape/{z}/{x}/{y}.png",
  },
  {
    id: "HOTOSM",
    data: "http://a.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
  },
  {
    id: "OpenCycleMap",
    data: "http://a.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png",
  },
  {
    id: "Watercolor",
    data: "http://a.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg",
  },
  {
    id: "Toner",
    data: "http://a.tile.stamen.com/toner-lite/{z}/{x}/{y}.png",
  },
  {
    id: "Cycle Map",
    data: "http://tile.thunderforest.com/cycle/{z}/{x}/{y}.png",
  },
  {
    id: "Black and White",
    data: "https://mt1.google.com/vt/lyrs=h&x={x}&y={y}&z={z}",
  },
];

const layerList = data.map((item) => ({
  ...item,
  title: item.id,
}));

export const OSMLayers = [
  {
    type: "LayerGroup",
    title: "OpenStreetMap",
    entries: layerList,
  },
];
