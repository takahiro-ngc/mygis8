import { setProps } from "../layerProps";

const html =
  "迅速測図（じんそくそくず）とは、日本において明治時代初期から中期にかけて大日本帝国陸軍参謀本部陸地測量部によって作成された簡易地図です。";

const attribution = {
  attributionName: "農研機構",
  attributionUrl: "https://aginfo.cgk.affrc.go.jp/tmc/layers.html.ja",
};

// ToDO 小数点の必要なしminZoom
const data = [
  // {
  //   id: "基盤地図情報 25000（等高線以外）",
  //   url: "https://aginfo.cgk.affrc.go.jp/ws/tmc/1.0.0/KBN25000BBB-900913-L/{z}/{x}/{y}.png",
  // },
  // {
  //   id: "基盤地図情報 25000（等高線のみ）",
  //   url: "https://aginfo.cgk.affrc.go.jp/ws/tmc/1.0.0/KBN25000CNB-900913-L/{z}/{x}/{y}.png",
  //   minZoom: 12.5,
  // },
  // {
  //   id: "基盤地図情報 2500",
  //   url: "https://aginfo.cgk.affrc.go.jp/ws/tmc/1.0.0/KBN2500FN-900913-L/{z}/{x}/{y}.png",
  //   minZoom: 13.5,
  // },

  // {
  //   id: "地名（色・縁取りあり）",
  //   url: "https://aginfo.cgk.affrc.go.jp/ws/tmc/1.0.0/pntms-900913-L/{z}/{x}/{y}.png",
  // },
  // {
  //   id: "地名（シンプル）",
  //   url: "https://aginfo.cgk.affrc.go.jp/ws/tmc/1.0.0/pn_thin-900913-L/{z}/{x}/{y}.png",
  // },
  {
    id: "歴史的農業環境 (迅速測図 東京5千分1)",
    url: "https://aginfo.cgk.affrc.go.jp/ws/tmc/1.0.0/Tokyo5000-900913-L/{z}/{x}/{y}.png",
  },
  {
    id: "歴史的農業環境 (迅速測図 関東平野)",
    url: "https://aginfo.cgk.affrc.go.jp/ws/tmc/1.0.0/Kanto_Rapid-900913-L/{z}/{x}/{y}.png",
  },
];

const layerList = data.map((item) => ({
  ...item,
  ...setProps(item.url),
  title: item.id,
  html: html,
  ...attribution,
  // minZoom: item.minZoom,
}));

export const noukenLayers = [
  {
    type: "LayerGroup",
    title: "農研機構",
    entries: layerList,
    html: html,
    ...attribution,
  },
];
