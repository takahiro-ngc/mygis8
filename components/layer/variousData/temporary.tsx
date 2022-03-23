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
// import Color from "color";
import * as turf from "@turf/turf";
// import { DataFilterExtension } from "@deck.gl/extensions";
import { parse } from "@loaders.gl/core";
// import { ZipLoader } from "@loaders.gl/zip";
import GL from "@luma.gl/constants";
import { colorBins, colorContinuous, colorCategories } from "@deck.gl/carto";
import { addCenterPosition } from "../../utils/utility";
import { TerrainWorkerLoader, TerrainLoader } from "../../../terrain/src";
import geojsonvt from "geojson-vt";
import { load } from "@loaders.gl/core";

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
    layerType: "GeoJsonLayer",
    id: "公示地価",
    title: "公示地価",
    data: "/layer/L01-20.json",
    getFillColor: colorBins({
      attr: (d) => Math.log2(Number(d.properties.L01_006)),
      domain: [14, 15, 16, 17, 18, 19, 20],
      // domain: [2, 23],
      // colors: "BluYl",
    }),
    // target: [128, 128, 0, 128],
    getText: (d) =>
      (Number(d.properties.L01_006) / 1000).toLocaleString() + "千",
    getTextSize: 20,

    textCharacterSet: "auto",
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
    layerType: "MVTLayer",
    id: "MVTLayerTippecanoe",
    title: "MVTLayerTippecanoe",
    data: "/zxy/{z}/{x}/{y}.pbf",
    filled: true,
    maxZoom: 9,
  },
  {
    layerType: "MVTLayer",
    id: "市町村界",
    title: "市町村界",
    data: "/市町村界/{z}/{x}/{y}.pbf",
    filled: false,
    maxZoom: 13,
    binary: false,
  },
];
