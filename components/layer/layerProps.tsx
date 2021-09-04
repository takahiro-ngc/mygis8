import { BitmapLayer } from "@deck.gl/layers";
import { KMLLoader } from "@loaders.gl/kml";
import { hex2rgb } from "../hex2rgb";
import { isTile, getFileType, isImage } from "../utility";
// import { JSONLoader } from "@loaders.gl/json";
// import { registerLoaders } from "@loaders.gl/core";
// registerLoaders([JSONLoader]);

// geojsonのスタイルは，以下のうち主な属性のみ実装
// https://github.com/mapbox/simplestyle-spec/tree/master/1.1.0
// https://github.com/gsi-cyberjapan/geojson-with-style-spec

export const setProps = (url, fileType) => {
  fileType = fileType || getFileType(url);
  const mainProps = {
    // deck.glにない独自プロパティ
    title: "untitled", //表示名。
    layerType: isTile(url) ? "TileLayer" : "GeoJsonLayer", //使用するdeck.glレイヤーの種類。
    fileType: fileType,
    isTile: isTile(url), //デバッグ用　不要？
    // loaders: [JSONLoader],

    // 基本
    ID: url, //同一URLが複数登録されているため，本当はurlだけでは不可
    data: url,
    pickable: true,
    autoHighlight: true,
    parameters: {
      depthTest: false, //傾けたときチラつくのを防ぐ。ただし3D的な描画が不可？
    },

    // 点関係
    getPointRadius: 5,
    pointRadiusUnits: "pixels",
    pointRadiusScale: 5,

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
    filled: true, //検討中
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

  const kmlProps = {
    loaders: [KMLLoader],
    loadOptions: {
      gis: { format: "geojson" },
    },
  };

  // ToDo imageとbitmapの用語
  const isBitmapTile = isTile(url) && isImage(fileType);

  return Object.assign(
    {},
    mainProps,
    isBitmapTile && bitmapTileProps,
    fileType === "kml" && kmlProps
  );
};

export const setPropsForGsi = (
  url,
  minZoom = 0,
  maxZoom = null,
  maxNativeZoom = null,
  iconUrl = null
) => {
  return {
    // タイル用
    // 「deck.glのmaxZoom = 地理院のmaxNativeZoom」である模様。
    // ただし，minZoomとの誤用？や（湖沼図諸元情報），記載漏れ（電子国土基本図更新情報）もある。
    // とりあえず，次のように設定するとうまくいくよう。
    minZoom: minZoom,
    maxZoom: isImage(url)
      ? maxNativeZoom ?? maxZoom
      : maxNativeZoom ?? minZoom ?? maxZoom ?? 2, //maxZoomではないので注意。2がデフォルトのよう

    // アイコン用
    // ToDo iconがある時は，circleを表示しない 土地条件図→日本の典型地形
    pointType: iconUrl ? "icon" : "circle+icon",
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
