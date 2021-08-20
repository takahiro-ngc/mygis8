import { setLayerProps } from "../layerProps";

// https://qiita.com/nyampire/items/fbe359a2c9ccf0116787
// https://ujicya.jp/blog-mapping/xyz-tiles-url/
// アウトドアとランドスケープ，サイクルは要api;
const data = [
  {
    id: "OpenStreetMap",
    url: "http://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
  },
  {
    id: "OpenStreetMap アウトドア",
    url: "http://a.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png",
  },

  {
    id: "landscape",
    url: "http://a.tile3.opencyclemap.org/landscape/{z}/{x}/{y}.png",
  },
  {
    id: "HOTOSM",
    url: "http://a.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
  },
  {
    id: "OpenCycleMap",
    url: "http://a.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png",
  },
  {
    id: "Watercolor",
    url: "http://a.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg",
  },
  {
    id: "Toner",
    url: "http://a.tile.stamen.com/toner-lite/{z}/{x}/{y}.png",
  },
  {
    id: "Cycle Map",
    url: "http://tile.thunderforest.com/cycle/{z}/{x}/{y}.png",
  },
  {
    id: "Black and White",
    url: "https://mt1.google.com/vt/lyrs=h&x={x}&y={y}&z={z}",
  },
];

const layerList = data.map((item) => ({
  id: item.id,
  title: item.id,
  ...setLayerProps(item.url),
}));

export const OSMLayers = [
  {
    type: "LayerGroup",
    title: "OpenStreetMap",
    entries: layerList,
  },
];
