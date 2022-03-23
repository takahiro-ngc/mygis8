import * as turf from "@turf/turf";
import { MVTLayer, TerrainLayer, TileLayer } from "@deck.gl/geo-layers";
import { GeoJsonLayer } from "@deck.gl/layers";

export const createLayerInstance = (layer) => {
  switch (layer.layerType) {
    case "TileLayer":
      return new TileLayer(layer);
    case "GeoJsonLayer":
      return new GeoJsonLayer(layer);
    case "TerrainLayer":
      return new TerrainLayer(layer);
    case "MVTLayer":
      return new MVTLayer(layer);
  }
};

export const mediaQuery = "(max-width:600px)";

// 中心座標を求める方法は，https://observablehq.com/@pessimistress/deck-gl-custom-layer-tutorial
// のgetLabelAnchorsを参考にし，さらにcase "LineString"を追加
export const getCenterPosition = (feature) => {
  const type = feature?.geometry?.type;
  const coordinates = feature?.geometry?.coordinates;

  switch (type) {
    case "Point":
      return coordinates;
    case "MultiPoint":
      return coordinates.flat();
    case "Polygon":
      return turf.centerOfMass(feature).geometry.coordinates;
    case "LineString":
      return turf.centerOfMass(feature).geometry.coordinates;
    case "MultiPolygon":
      let polygons = coordinates.map((rings) => turf.polygon(rings));
      const areas = polygons.map(turf.area);
      const maxArea = Math.max.apply(null, areas);
      // Filter out the areas that are too small
      return polygons
        .filter((f, index) => areas[index] > maxArea * 0.5)
        .flatMap((f) => turf.centerOfMass(f).geometry.coordinates);
    default:
      return [];
  }
};

export const addCenterPosition = (data) => {
  const newFeatures = (data.features || data).map((feature) => {
    const labelAnchors = getCenterPosition(feature);

    const result = {
      type: "Feature",
      properties: feature.properties,
      geometry: {
        type: "Point",
        coordinates: labelAnchors,
      },
    };

    return result;
  });
  data.features
    ? (data.features = [...data.features, ...newFeatures])
    : (data = [...data, ...newFeatures]);
  return data;
};
export const roundToSix = (num) => +(Math.round(num + "e+6") + "e-6");

export const imgFileType = [
  "png",
  "jpg",
  "jpeg",
  "gif",
  "webp",
  "bmp",
  "ico",
  "svg",
];
export const allowFileTypeList = [...imgFileType, "geojson"];

export const getFileType = (value) => {
  const string = value?.toString() || ""; //数値のことがあるため
  return string?.split(/[#?]/)[0].split(".").pop().trim().toLowerCase();
};
export const isImage = (value) => imgFileType.includes(getFileType(value));

export const getFileTypeCategory = (value) =>
  isImage(value) ? "bitmap" : getFileType(value);

export const unique = (array) => [...new Set(array)];

export const isValidUrl = (url) => {
  const res = url?.match(
    /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
  );
  return res !== null;
};

export const isTile = (url) => {
  const d = url?.toString().toLowerCase().slice(0, 100) || "";
  return d.includes("{x}") && d.includes("{y}") && d.includes("{z}");
};

export function hex2rgb(hex: string) {
  // hex2rgb( "#ff8040" ) > [ 255, 128, 64 ]
  // hex2rgb( "#f00" ) > [ 255, 0, 0 ]
  // hex2rgb( "f00" ) > [ 255, 0, 0 ]
  if (hex.slice(0, 1) == "#") hex = hex.slice(1);
  if (hex.length == 3)
    hex =
      hex.slice(0, 1) +
      hex.slice(0, 1) +
      hex.slice(1, 2) +
      hex.slice(1, 2) +
      hex.slice(2, 3) +
      hex.slice(2, 3);

  return [hex.slice(0, 2), hex.slice(2, 4), hex.slice(4, 6)].map(function (
    str
  ) {
    return parseInt(str, 16);
  });
}

export function rgb2hex(rgb) {
  // rgb2hex( [ 255, 128, 64 ] ) > #ff8040
  return (
    "#" +
    rgb
      .map(function (value) {
        return ("0" + value.toString(16)).slice(-2);
      })
      .join("")
  );
}
