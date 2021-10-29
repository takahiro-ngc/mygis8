// ユーティリティ
import { normarize, centroidLonLat } from "../../utils/utility";
import {
  BitmapLayer,
  IconLayer,
  GeoJsonLayer,
  TextLayer,
} from "@deck.gl/layers";
import { KMLLoader } from "@loaders.gl/kml";
import { CesiumIonLoader } from "@loaders.gl/3d-tiles";
import { QuantizedMeshLoader } from "@loaders.gl/terrain";
// import * as d3 from "d3";
// import Color from "color";
import * as turf from "@turf/turf";
// import { characterSet } from "../characterSet";
// import { DataFilterExtension } from "@deck.gl/extensions";
import { parse } from "@loaders.gl/core";
import { ZipLoader } from "@loaders.gl/zip";
import GL from "@luma.gl/constants";
import { colorBins, colorContinuous, colorCategories } from "@deck.gl/carto";
import { addCenterPosition } from "../../utils/utility";
import { TerrainWorkerLoader, TerrainLoader } from "../../../terrain/src";

// https://github.com/visgl/deck.gl/issues/3489
// https://luma.gl/docs/api-reference/gltools/context

// colorBins関数などのcarto関数はcartoレイヤーでなくても使用できて便利（元データが文字列の場合，数値変換が必要なことに注意）
// // https://github.com/visgl/deck.gl/discussions/5532
const labelSizeScale = (f) => Math.pow(2, Math.log10(turf.area(f)));

// const numScale = d3.scaleLinear().domain([0.1, 1]).range([0, 1]);

const deckglDefault = {
  pickable: false,
  autoHighlight: false,
  filled: true,
  stroked: true,
  extruded: false,
};
const settingForBoundary = {
  pickable: true,
  autoHighlight: true,
  stroked: true,
  filled: false, //falseでないと下層レイヤーが透過しない
  opacity: 1,
  getFillColor: () => [
    Math.random() * 255,
    Math.random() * 255,
    Math.random() * 255,
  ],
  getLineColor: [0, 0, 0, 255],
  getLineWidth: 10,
  lineWidthScale: 0.1,
  lineWidthUnits: "pixels",
};

export const otherLayers = [
  {
    layerType: "TerrainLayer",
    id: "terrain",
    title: "terrain",
    data: "null",

    elevationData:
      "https://cyberjapandata.gsi.go.jp/xyz/dem_png/{z}/{x}/{y}.png",
    texture:
      "https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/{z}/{x}/{y}.jpg",

    elevationDecoder: {
      rScaler: 2,
      gScaler: 0,
      bScaler: 0,
      offset: 0,
    },
  },

  {
    layerType: "MVTLayer",
    id: "MVTLayer",
    title: "MVTLayer",
    data: "https://cyberjapandata.gsi.go.jp/xyz/experimental_bvmap/{z}/{x}/{y}.pbf",
    binary: true,
    ...settingForBoundary,
    getLineColor: (f) => {
      switch (f.properties.layerName) {
        case "contour":
          return [255, 0, 0];
        case "road":
          return [0, 255, 0];
        case "railway":
          return [255, 255, 0];
        case "boundary":
          return [255, 0, 255];
        default:
          return [0, 0, 0];
      }
    },
    getFillColor: (f) => {
      switch (f.properties.layerName) {
        case "symbol":
          return [255, 0, 0];

        default:
          return [0, 255, 0];
      }
    },
    pointRadiusMinPixels: 5,
    filled: true,
    // dataTransform: (d) => console.log("d", d),
  },
  {
    // layerType: "TileLayer",
    layerType: "GeoJsonLayer",
    id: "公示地価",
    title: "公示地価",
    // data: "https://maps.gsi.go.jp/xyz/cp/{z}/{x}/{y}.geojson",
    data: "/layer/L01-20.json",
    // highlightedObjectIndex: 3s,

    pointRadiusUnits: "meters",
    pointRadiusScale: 10,
    getPointRadius: 500,
    pointRadiusMinPixels: 3,
    pointRadiusMaxPixels: 10,
    // getFillColor: colorBins({
    //   attr: (d) => Math.log2(Number(d.properties.L01_006)),
    //   domain: [14, 15, 16, 17, 18, 19, 20],
    //   // domain: [2, 23],
    //   // colors: "BluYl",
    // }),
    // target: [128, 128, 0, 128],
    // pointType: "circle",
    // pointType: "circle+text+icon",
    // getIcon: (d) => {
    //   const src = d.properties;
    //   return {
    //     url: "https://maps.gsi.go.jp/portal/sys/v4/symbols/skhb.png",
    //     width: src?._iconSize?.[0] ?? 20,
    //     height: src?._iconSize?.[1] ?? 20,
    //     anchorX: src?._iconAnchor?.[0] ?? 10,
    //     anchorY: src?._iconAnchor?.[1] ?? 10,
    //   };
    // },
    // getIconSize: 24, //必須
    // pickable: true,
    // autoHighlight: true,
    // getText: (d) =>
    //   (Number(d.properties.L01_006) / 1000).toLocaleString() + "千",
    // getTextSize: 200,
    // textSizeMaxPixels: 20,
    // textSizeUnits: "meters",
    // textCharacterSet: "auto",
    // getTextPixelOffset: [0, 20],
  },

  {
    layerType: "GeoJsonLayer",
    id: "公示地価zip",
    title: "公示地価zip",
    data: "/layer/L01-20.zip",
    loaders: [ZipLoader],
    dataTransform: (d) =>
      JSON.parse(new TextDecoder().decode(d["L01-20.json"])),
    pointRadiusUnits: "meters",
    pointRadiusScale: 10,
    getPointRadius: 500,
    pointRadiusMinPixels: 3,
    pointRadiusMaxPixels: 10,
    getFillColor: colorBins({
      attr: (d) => Math.log2(Number(d.properties.L01_006)),
      domain: [14, 15, 16, 17, 18, 19, 20],
      // domain: [2, 23],
      // colors: "BluYl",
    }),

    pointType: "circle+text",
    getText: (d) =>
      (Number(d.properties.L01_006) / 1000).toLocaleString() + "千",
    getTextSize: 200,
    textSizeMaxPixels: 20,
    textSizeUnits: "meters",
    textCharacterSet: "auto",
    getTextPixelOffset: [0, 20],
  },
  {
    layerType: "GeoJsonLayer",
    id: "境界_都道府県",
    title: "境界_都道府県",
    data: "/layer/N03-20_200101_dissolve_5p.json",
    ...settingForBoundary,

    dataTransform: (d) => addCenterPosition(d),
    pointType: "text",
    getLineWidth: 10,
    getTextSize: 10000,
    getText: (d) => d.properties.N03_001,
    textSizeMaxPixels: 20,
    textSizeUnits: "meters",
    textCharacterSet: "auto",
  },
  {
    layerType: "GeoJsonLayer",
    id: "境界_市町村区_全国（圧縮）",
    title: "境界_市町村区_全国（圧縮）",

    data: "/layer/N03-20_200101_03p.json",
    ...settingForBoundary,

    dataTransform: (d) => addCenterPosition(d),
    pointType: "text",
    getLineWidth: 10,
    getTextSize: 1000,
    getText: (d) => d.properties.N03_004,
    textSizeMaxPixels: 20,
    textSizeUnits: "meters",
    textCharacterSet: "auto",
  },

  {
    layerType: "GeoJsonLayer",
    id: "境界_町丁・字等_全国",
    title: "境界_町丁・字等_全国",
    data: "/layer/h27ka_snap_clean_prevrem_1p.json",
    ...settingForBoundary,
    dataTransform: (d) => addCenterPosition(d),
    pointType: "text",
    getLineWidth: 10,
    getTextSize: 400,
    getText: (d) => d.properties.S_NAME,
    textSizeMaxPixels: 20,
    textSizeUnits: "meters",
    textCharacterSet: "auto",
  },

  {
    layerType: "GeoJsonLayer",
    id: "国土数値情報_人口_全国",
    title: "国土数値情報_人口_全国",
    data: "/layer/suikei140704_00.json",
    ...settingForBoundary,
    getFillColor: (f) => [Math.log10(f.properties.POP2010) * 50, 0, 0],
    filled: true,
  },

  {
    // layerType: "GsiTerrainLayer",
    layerType: "TerrainLayer",
    id: "gsiTerrain",
    title: "gsiTerrain",
    elevationDecoder: {
      rScaler: 6553.6,
      gScaler: 25.6,
      bScaler: 0.1,
      offset: -10000,
      // scaler: 0.1,
    },
    // elevationDecoder: {
    //   scaler: 0.03, // 分解能, 実寸なら0.01
    //   offset: 0, // RGB値がゼロの場合の標高値
    // },
    loaders: [TerrainLoader],

    elevationData:
      "https://cyberjapandata.gsi.go.jp/xyz/dem5a_png/{z}/{x}/{y}.png",
    // "https://cyberjapandata.gsi.go.jp/xyz/dem_png/{z}/{x}/{y}.png",
    texture:
      //  "https://cyberjapandata.gsi.go.jp/xyz/dem_png/{z}/{x}/{y}.png",
      "https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/{z}/{x}/{y}.jpg",
    autoHighlight: false,
  },
];
