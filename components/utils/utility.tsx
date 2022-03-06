// ユーティリティ
// import * as d3 from "d3";
import * as turf from "@turf/turf";
// import Color from "./layerData/node_modules/color";
import { FlyToInterpolator } from "deck.gl";
import { MVTLayer, TerrainLayer, TileLayer } from "@deck.gl/geo-layers";
import { ColumnLayer, GeoJsonLayer } from "@deck.gl/layers";

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

export const jumpSetting = {
  transitionDuration: "auto",
  transitionInterpolator: new FlyToInterpolator(),
  transitionEasing: (x) =>
    x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2, //easeInOutQuad
};

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

//   export const getLayerType=(url)=>{
// const isTile=isTile(url)

//   }

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

// https://lab.syncer.jp/Web/JavaScript/Snippet/61/
export function hex2rgb(hex: string) {
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
// hex2rgb( "#ff8040" ) ;	// [ 255, 128, 64 ]
// hex2rgb( "#f00" ) ;	// [ 255, 0, 0 ]
// hex2rgb( "f00" ) ;	// [ 255, 0, 0 ]

export function rgb2hex(rgb) {
  return (
    "#" +
    rgb
      .map(function (value) {
        return ("0" + value.toString(16)).slice(-2);
      })
      .join("")
  );
}
// rgb2hex( [ 255, 128, 64 ] ) ;	// #ff8040

// 説明 正規化関数
// 参考 https://zukucode.com/2017/04/javascript-object-max.html
// 参考 https://qiita.com/ndj/items/82e9c5a4518fe16e539f

// const calcMax = (source, index) => {
//   const aryMax = (a, b) => Math.max(a, b);
//   const numberAry = source.features.map((p) => p.properties[index]);
//   let max = numberAry.reduce(aryMax);
//   return max;
// };
// const calcMin = (source, index) => {
//   const aryMin = (a, b) => Math.min(a, b);
//   const numberAry = source.features.map((p) => p.properties[index]);
//   let min = numberAry.reduce(aryMin);
//   return min;
// };

// export const normarize = (data, source, index) => {
//   let max = calcMax(source, index);
//   let min = calcMin(source, index);
//   // 補足 線形 scaleLinear 対数 scaleLog
//   // 参考 https://www.d3indepth.com/scales/
//   const normarizeFunc = d3.scaleLog().domain([min, max]).range([0, 1]); // 関数の定義
//   const norm = normarizeFunc(data);
//   const rgb = d3.interpolateRainbow(norm); // rgb(x,y,z)
//   return Color.rgb(rgb).array(); // [x,y,z];
// };

// export const centroidLonLat = (data) => {
//   const centroid = turf.centroid(data);
//   const longitude = centroid.geometry.coordinates[0];
//   const latitude = centroid.geometry.coordinates[1];
//   return { longitude: longitude, latitude: latitude };
// };

// キャラクターセットの取得
// const getData = () => {
// fetch("h27ka_snap_clean_prevrem_1p.json")
// .then((response) => response.json())
// .then((d) => getCharacterSet(d, "S_NAME"))
// .then((d) => JSON.stringify(d))
// .then((d) => console.log(d));
