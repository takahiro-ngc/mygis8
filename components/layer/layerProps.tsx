import { BitmapLayer, IconLayer } from "@deck.gl/layers";
import { KMLLoader } from "@loaders.gl/kml";
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
  getLineColor: (d) => [
    ...hex2rgb(d.properties?._color || d.properties?.lineColor || "#000000"),
    d.properties?._opacity * 255 || 255,
  ],
  getFillColor: (d) => [
    ...hex2rgb(
      d.properties?._fillColor || d.properties?.polyColor || "#00ff00"
    ),
    d.properties?._fillOpacity * 255 || 255,
  ],
};

// https://deck.gl/docs/api-reference/core/composite-layer#_sublayerprops
// ToDo アイコンの設定が無いときは，IconLayerにしない
const iconLayerProps = (iconUrl) => ({
  _subLayerProps: {
    points: {
      type: IconLayer,
      getIcon: (d) => {
        const src = d.__source?.object?.properties;
        return {
          url: src?._iconUrl || src?.icon || iconUrl || "/img/test3.png", //ToDoデフォルトアイコン
          width: src?._iconSize?.[0] ?? 20,
          height: src?._iconSize?.[1] ?? 20,
          anchorX: src?._iconAnchor?.[0] ?? 10,
          anchorY: src?._iconAnchor?.[1] ?? 10,
        };
      },
      getSize: (d) => 32, //必須
    },
  },
});

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
  );
};
