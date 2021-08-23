import { BitmapLayer, IconLayer } from "@deck.gl/layers";
import { KMLLoader } from "@loaders.gl/kml";
import { common } from "@material-ui/core/colors";
import { HeadsetMicOutlined } from "@material-ui/icons";
import { hex2rgb } from "../hex2rgb";
import { isTile, getFileTypeCategory } from "../utility";

const elevationData =
  "https://cyberjapandata.gsi.go.jp/xyz/dem_png/{z}/{x}/{y}.png";

const commonProps = (url) => ({
  layerType: isTile(url) ? "TileLayer" : "GeoJsonLayer",
  data: url,
  isTile: isTile(url),
  fileType: getFileTypeCategory(url),
  parameters: {
    depthTest: false,
  },
});

const tileBitmapProps = (url, minZoom, maxZoom, maxNativeZoom) => ({
  minZoom: minZoom,
  maxZoom: maxNativeZoom ?? maxZoom,
  tileSize: 256,
  renderSubLayers: (props) => {
    const {
      bbox: { west, south, east, north },
    } = props.tile;
    return new BitmapLayer({
      ...props,
      data: null,
      image: props.data,
      bounds: [west, south, east, north],
    });
  },

  // GsiTerrainLayer用設定
  elevationDecoder: {
    scaler: 0.01, // 分解能, 実寸なら0.01
    offset: 0, // RGB値がゼロの場合の標高値
  },
  elevationData: elevationData,
  texture: url,
});

const geojsonProps = {
  pickable: true,
  autoHighlight: true,
  pointRadiusUnits: "pixels",
  lineWidthUnits: "pixels",
  getRadius: 10,
  getLineWidth: (d) => Number(d.properties?.lineWidth) || 3,
  getLineColor: (d) => {
    const hex =
      d.properties?._color ||
      d.properties?.lineColor ||
      d.properties?.stroke ||
      "#000000";
    const opacity = d.properties?._opacity || 1;
    return [...hex2rgb(hex), opacity * 255];
  },
  getFillColor: (d) => {
    const hex =
      d.properties?._fillColor || d.properties?.polyColor || "#0033ff";
    const opacity = d.properties?._fillOpacity || d.properties?._opacity || 1;
    return [...hex2rgb(hex), opacity * 255];
  },
};

const iconLayerProps = (iconUrl) => {
  const pointType = iconUrl ? "icon" : "circle+icon";
  return {
    pointType: pointType,
    getIcon: (d) => {
      const src = d.properties;
      return {
        url: src?._iconUrl || src?.icon || iconUrl,
        width: src?._iconSize?.[0] ?? 20,
        height: src?._iconSize?.[1] ?? 20,
        anchorX: src?._iconAnchor?.[0] ?? 10,
        anchorY: src?._iconAnchor?.[1] ?? 10,
      };
    },
    getIconSize: 24, //必須
  };
};

const tileGeojsonProps = (minZoom, maxNativeZoom) => ({
  // 電子国土基本図更新情報等はzoomの設定がない。デフォルトは2とされているよう。
  minZoom: minZoom ?? 2,
  maxZoom: maxNativeZoom ?? minZoom ?? 2, //湖沼図緒元情報等のポリゴン系はmaxZoomでは表示されないためminZoom
  tileSize: 256,
  ...geojsonProps,
});

const kmlProps = {
  loaders: [KMLLoader],
  loadOptions: {
    gis: { format: "geojson" },
  },
  ...geojsonProps,
};

export const setLayerProps = (
  url,
  minZoom = null,
  maxZoom = null,
  maxNativeZoom = null,
  iconUrl = null
) => {
  const isBitmap = getFileTypeCategory(url) === "bitmap";
  const isGeojson = getFileTypeCategory(url) === "geojson";
  const isKml = getFileTypeCategory(url) === "kml";
  const isGsi = url.includes("gsi.go.jp");

  return Object.assign(
    {},
    commonProps(url),
    isTile(url) &&
      isBitmap &&
      tileBitmapProps(url, minZoom, maxZoom, maxNativeZoom),
    isTile(url) && isGeojson && tileGeojsonProps(minZoom, maxNativeZoom),
    !isTile(url) && isGeojson && geojsonProps,
    isKml && kmlProps,
    isGsi && (isGeojson || isKml) && iconLayerProps(iconUrl)

    // {
    //   pickable: true,
    //   autoHighlight: true,
    //   stroked: true,
    //   filled: true, //falseでないと下層レイヤーが透過しない
    //   opacity: 1,
    //   getFillColor: () => [
    //     Math.random() * 255,
    //     Math.random() * 255,
    //     Math.random() * 255,
    //   ],
    //   getLineColor: [0, 0, 0, 255],
    //   getLineWidth: 10,
    //   lineWidthScale: 0.1,
    //   lineWidthUnits: "pixels",
    //   // lineJointRounded: true,
    // }
  );
};

//ここから
// export const setProps = (url, fileType) => {
//   fileType = fileType || getFileType(url); //確認済み

//   const mainProps = {
//     // 独自プロパティ（必須）
//     title: url, //表示名
//     layerType: isTile(url) ? "TileLayer" : "GeoJsonLayer", //使用するdeck.glレイヤーの種類
//     fileType: fileType, //デバッグ用

//     // 基本
//     ID: url + Math.random(), //同一URLが複数登録されることがある
//     data: url,
//     pickable: true,
//     autoHighlight: false,
//     parameters: {
//       depthTest: false, //傾けたときチラつくのを防ぐ。ただし高さ無効？
//     },

//     // ライン・ポリゴン関係
//     filled: false,
//     getFillColor: [0, 0, 255, 128],
//     getLineWidth: 5,
//     lineWidthUnits: "pixels",

//     // 点関係
//     getPointRadius: 5,
//     pointRadiusUnits: "pixels",
//     pointRadiusScale: 5,
//   };

//   const tileProps = {
//     tileSize: 256,
//     pickable: false,
//   };

//   const bitmapTileProps = {
//     renderSubLayers: (props) => {
//       const {
//         bbox: { west, south, east, north },
//       } = props.tile;
//       return new BitmapLayer({
//         ...props,
//         data: null,
//         image: props.data,
//         bounds: [west, south, east, north],
//       });
//     },
//   };

//   const kmlProps = {
//     loaders: [KMLLoader],
//     loadOptions: {
//       gis: { format: "geojson" },
//     },
//   };

//   const isBitmapTile = isTile && fileType === "bitmapTile";
//   return Object.assign(
//     {},
//     mainProps,
//     isTile && tileProps,
//     fileType === "bitmapTile" && bitmapTileProps,
//     fileType === "kml" && kmlProps
//   );
// };

// export const setPropsForGsi = (
//   minZoom = 0,
//   maxZoom = null,
//   maxNativeZoom = null,
//   iconUrl = null
// ) => {
//   const mainProps = {
//     getLineWidth: (d) => Number(d.properties?.lineWidth) || 3,
// getLineColor: (d) => {
//   const hex = d.properties?._color || d.properties?.lineColor || "#000000";
//   const opacity = d.properties?._opacity || 1;
//   return [...hex2rgb(hex), opacity * 255];
// },
// getFillColor: (d) => {
//   const hex =
//     d.properties?._fillColor || d.properties?.polyColor || "#0033ff";
//   const opacity = d.properties?._fillOpacity || d.properties?._opacity || 1;
//   return [...hex2rgb(hex), opacity * 255];
// },

//   const bitmapTileProps = {
//     minZoom: minZoom,
//     maxZoom: maxNativeZoom ?? maxZoom,
//   };

//   const geojsonTileProps = {
//     minZoom: minZoom ?? 2, // 電子国土基本図更新情報等はzoomの設定がない。デフォルトは2とされているよう。
//     maxZoom: maxNativeZoom ?? minZoom ?? 2, //湖沼図緒元情報等のポリゴン系はmaxZoomでは表示されないが，minZoomにすると表示される。
//   };

//   // https://deck.gl/docs/api-reference/core/composite-layer#_sublayerprops
//   // ToDo アイコンの設定が無いときは，IconLayerにしない　circle+iconでgeticonをnullでok?
//   const iconLayerProps = {
//     _subLayerProps: {
//       points: {
//         type: IconLayer,
//         getIcon: (d) => {
//           const src = d.__source?.object?.properties;
//           return {
//             url: src?._iconUrl || src?.icon || iconUrl || "/img/test3.png", //ToDoデフォルトアイコン
//             width: src?._iconSize?.[0] ?? 20,
//             height: src?._iconSize?.[1] ?? 20,
//             anchorX: src?._iconAnchor?.[0] ?? 10,
//             anchorY: src?._iconAnchor?.[1] ?? 10,
//           };
//         },
//         getSize: (d) => 32, //必須
//       },
//     },
//   };
//   return Object.assign(
//     {},
//     mainProps,
//     bitmapTileProps,
//     geojsonTileProps,
//     iconLayerProps
//   );
// };
