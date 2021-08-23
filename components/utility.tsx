// ユーティリティ
// import * as d3 from "d3";
import * as turf from "@turf/turf";
// import Color from "./layerData/node_modules/color";

const getLabelAnchors = (feature) =>
  // Extract anchor positions from features. We will be placing labels at these positions.
  {
    const { type, coordinates } = feature.geometry;
    switch (type) {
      case "Point":
        return [coordinates];
      case "MultiPoint":
        return coordinates;
      case "Polygon":
        return [turf.centerOfMass(feature).geometry.coordinates];
      case "MultiPolygon":
        let polygons = coordinates.map((rings) => turf.polygon(rings));
        const areas = polygons.map(turf.area);
        const maxArea = Math.max.apply(null, areas);
        // Filter out the areas that are too small
        return polygons
          .filter((f, index) => areas[index] > maxArea * 0.5)
          .map((f) => turf.centerOfMass(f).geometry.coordinates);
      default:
        return [];
    }
  };
export const addCenterPosition = (data) => {
  const newFeatures = (data.features || data).map((feature) => {
    const labelAnchors = getLabelAnchors(feature).flat();

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

export const getUrlFileType = (value) => {
  const string = value?.toString() || ""; //数値のことがあるため
  return string?.split(/[#?]/)[0].split(".").pop().trim().toLowerCase();
};
export const isImage = (url) => imgFileType.includes(getUrlFileType(url));

export const getFileTypeCategory = (url) =>
  isImage(url) ? "bitmap" : getUrlFileType(url);

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
  const d = url.toLowerCase();
  return d.includes("{x}") && d.includes("{y}") && d.includes("{z}");
};
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
