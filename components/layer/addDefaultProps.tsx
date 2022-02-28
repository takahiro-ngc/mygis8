import { BitmapLayer } from "@deck.gl/layers";
import { KMLLoader } from "@loaders.gl/kml";
import { isTile, getFileType, isImage, hex2rgb } from "../utils/utility";
import { TerrainLayer } from "@deck.gl/geo-layers";
// geojsonのスタイルは，以下のうち主な属性のみ実装
// https://github.com/mapbox/simplestyle-spec/tree/master/1.1.0
// https://github.com/gsi-cyberjapan/geojson-with-style-spec

// ToDo defaultPropsとaddDefaultPropsに分割
export const addDefaultProps = (item) => {
  const data = item.data;

  const mainProps = {
    // deck.glにない独自プロパティ
    layerType: isTile(data) ? "TileLayer" : "GeoJsonLayer", //使用するdeck.glレイヤーの種類。
    // fileType: fileType,
    isTile: isTile(data), //デバッグ用

    // タイルレイヤー（GSI）用
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
    // ToDo loadersの設定を消さないとmvtLayerやterrainが描画できない
    // loaders: [KMLLoader],

    // 点関係
    pointRadiusUnits: "pixels",
    pointRadiusScale: 3,
    getPointRadius: 3,

    // ライン関係
    lineWidthUnits: "pixels",
    getLineWidth: (d) => Number(d.properties?.lineWidth) || 3, //地理院のlineWidthは文字列のことがある
    getLineColor: (d) => {
      const src = d.properties;
      const hex = src?._color || src?.lineColor || src?.stroke || "#000000";
      const opacity = src?._opacity || src?.["stroke-opacity"] || 1;
      return [...hex2rgb(hex), opacity * 255];
    },

    // ポリゴン関係
    filled: true,
    getFillColor: (d) => {
      const src = d.properties;
      const hex = src?._fillColor || src?.polyColor || "#0033ff";
      const opacity = src?._fillOpacity || src?._opacity || 0.5;
      return [...hex2rgb(hex), opacity * 255];
    },

    // タイルレイヤー用
    tileSize: 256,
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

  // ToDo imageとbitmapの用語
  const isBitmapTile = isTile(data) && isImage(data);

  return Object.assign({}, mainProps, isBitmapTile && bitmapTileProps, item);
};