import { BitmapLayer } from "@deck.gl/layers";
import { KMLLoader } from "@loaders.gl/kml";
import { hex2rgb } from "../hex2rgb";
import { isTile, getFileType, isImage } from "../utility";
import { load } from "@loaders.gl/core";
import { registerLoaders } from "@loaders.gl/core";
// import { ShapefileLoader } from "@loaders.gl/shapefile";
// registerLoaders([KMLLoader, ShapefileLoader]);

// registerLoaders([KMLLoader]); data: load(url),
// data: load(url,[KMLLoader]),
// のどちらでも，fileObjectからkml,jsonの読込できた 　ただしタイルの設定をしないとランタイムエラー多発
// loadがないとkmlもjsonも読み込めない

export const setProps = (url, fileType) => {
  fileType = fileType || getFileType(url);
  const mainProps = {
    // deck.glにない独自プロパティ
    // title: url, //表示名。個別設定を想定。
    layerType: "GeoJsonLayer", //使用するdeck.glレイヤーの種類。
    // layerType: isTile(url) ? "TileLayer" : "GeoJsonLayer", //使用するdeck.glレイヤーの種類。
    fileType: fileType,
    // isTile: isTile(url), //デバッグ用　不要？

    // 基本
    ID: url, //同一URLが複数登録されているため，本当はurlだけでは不可
    data: url,
    pickable: true,
    autoHighlight: false,
    parameters: {
      depthTest: false, //傾けたときチラつくのを防ぐ。ただし3D的な描画が不可？
    },

    // ライン・ポリゴン関係
    filled: false,
    getFillColor: [0, 0, 255, 128],
    getLineWidth: 4,
    lineWidthUnits: "pixels",

    // 点関係
    getPointRadius: 5,
    pointRadiusUnits: "pixels",
    pointRadiusScale: 5,

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
  // const isBitmapTile = isTile(url) && isImage(fileType);

  return Object.assign(
    {},
    mainProps,
    // isBitmapTile && bitmapTileProps,
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
  const mainProps = {
    getLineWidth: (d) => Number(d.properties?.lineWidth) || 3,
    getLineColor: (d) => {
      const src = d.properties;
      const hex = src?._color || src?.lineColor || src?.stroke || "#000000";
      const opacity = src?._opacity || 1;
      return [...hex2rgb(hex), opacity * 255];
    },
    filled: true,
    getFillColor: (d) => {
      const src = d.properties;
      const hex = src?._fillColor || src?.polyColor || "#0033ff";
      const opacity = src?._fillOpacity || src?._opacity || 1;
      return [...hex2rgb(hex), opacity * 255];
    },
  };

  // 「deck.glのmaxZoom = 地理院のmaxNativeZoom」である模様。
  // ただし，minZoomとの誤用？や（湖沼図諸元情報），記載漏れ（電子国土基本図更新情報）もある。
  // とりあえず，次のように設定するとうまくいくよう。
  const tileProps = {
    minZoom: minZoom,
    maxZoom: isImage(url)
      ? maxNativeZoom ?? maxZoom
      : maxNativeZoom ?? minZoom ?? 2, //maxZoomではないので注意。2がデフォルトのよう
  };

  const iconProps = {
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

  return Object.assign({}, mainProps, tileProps, iconProps);
};
