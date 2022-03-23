import { BitmapLayer } from "@deck.gl/layers";
import { KMLLoader } from "@loaders.gl/kml";
import { isTile, getFileType, isImage, hex2rgb } from "../utils/utility";
// geojsonのスタイルは，以下のうち主な属性のみ実装
// https://github.com/mapbox/simplestyle-spec/tree/master/1.1.0
// https://github.com/gsi-cyberjapan/geojson-with-style-spec

// ToDo defaultPropsとaddDefaultPropsに分割
export const addDefaultProps = (item) => {
  const data = item.data;
  const fileType = getFileType(item.data);
  const isMapboxFile = fileType === "pbf" || fileType === "mvt";
  const isKml = fileType === "kml";
  const isBitmapTile = isTile(data) && isImage(data);

  const mainProps = {
    layerType: isTile(data)
      ? isMapboxFile
        ? "MVTLayer"
        : "TileLayer"
      : "GeoJsonLayer", //使用するdeck.glレイヤーの種類。
    // fileType: fileType,
    isTile: isTile(data), //デバッグ用

    // TerrainLayer用
    // https://gbank.gsj.jp/seamless/elev/tile.html
    elevationData: "https://tiles.gsj.jp/tiles/elev/mixed/{z}/{y}/{x}.png",
    texture: item.data,

    // 基本
    id: data, //同一URLが複数登録されているため，本当はurlだけでは不可
    data: data,
    pickable: true,
    autoHighlight: true,
    parameters: {
      depthTest: false, //傾けたときチラつくのを防ぐ。ただし3D的な描画が不可？
    },
    highlightColor: [255, 0, 0, 128],

    // 点関係
    pointRadiusUnits: "pixels",
    pointRadiusScale: 2,
    getPointRadius: 5,

    // ライン関係
    lineWidthUnits: "pixels",
    getLineWidth: (d) => Number(d.properties?.lineWidth) || 2, //地理院のlineWidthは文字列のことがある
    getLineColor: (d) => {
      const src = d?.properties;
      const hex = src?._color || src?.lineColor || src?.stroke || "#000000";
      const opacity = src?._opacity || src?.["stroke-opacity"] || 1;
      return [...hex2rgb(hex), opacity * 255];
    },

    // ポリゴン関係
    filled: true,
    getFillColor: (d) => {
      const src = d?.properties;
      const hex = src?._fillColor || src?.polyColor || "#0033ff";
      const opacity = src?._fillOpacity || src?._opacity || 0.5;
      return [...hex2rgb(hex), opacity * 255];
    },

    // TileLayer用
    tileSize: 256,

    // GeoJsonLayer用
    pointType: "circle",
    getText: (f) => Object?.values(f?.properties)?.[0],
    getTextSize: 18,
    textOutlineColor: [255, 255, 255, 255],
    textOutlineWidth: 0.5,
    textFontSettings: { sdf: true },
    textCharacterSet: "auto",
    getTextPixelOffset: [0, 20],
  };

  const bitmapTileProps = {
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
    pickable: false,
  };

  const kmlProps = { loaders: [KMLLoader] };

  return Object.assign(
    {},
    mainProps,
    isBitmapTile && bitmapTileProps,
    isKml && kmlProps,
    item
  );
};
