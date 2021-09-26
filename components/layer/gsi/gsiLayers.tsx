import { addPropsForGsiLayer } from "./addPropsForGsiLayer";

import layers0 from "./layers0.json";
import layers1 from "./layers1.json";
import layers2 from "./layers2.json";
import layers3 from "./layers3.json";
import layers4 from "./layers4.json";
import layers5 from "./layers5.json";
import layers6 from "./layers6.json";
import layers7 from "./layers7.json";

// データは20200101時点
// https://github.com/gsi-cyberjapan/gsimaps/tree/gh-pages/layers_txt
// https://github.com/gsi-cyberjapan/layers-dot-txt-spec/blob/master/specifications.md

export const layerList = [
  {
    type: "LayerGroup",
    title: "国土地理院",
    entries: [
      ...layers0.layers,
      ...layers1.layers,
      ...layers2.layers,
      ...layers3.layers,
      ...layers4.layers,
      ...layers5.layers,
      ...layers6.layers,
      ...layers7.layers,
    ],
  },
];

const notes = {
  notes: (
    <div>
      説明は，出典サイトからの引用です。
      <br />
      特殊な設定のある一部データは，動作しなかったり，説明と異なる表示になる場合があります。
    </div>
  ),
};

const attribution = {
  attributionName: "地理院地図（国土地理院）",
  attributionUrl: "https://maps.gsi.go.jp",
};

const isSouthpoleLayer = (id) => id === "southpole_satellite_250000_spec";
const southpoleArea = {
  lat: -73.558561,
  lng: 38.321278,
  zoom: 1,
};

const addProps = (list) =>
  list.map((d) => {
    return {
      ...d,
      ...notes,
      ...attribution,
      ...(d.type === "Layer" && addPropsForGsiLayer(d)),
      ...(isSouthpoleLayer(d.id) && { area: southpoleArea }),
      ...(d.entries && { entries: addProps(d.entries) }),
    };
  });

export const gsiLayers = addProps(layerList);

// d.srcの中身は，以下で確認できるが，データ数が多いため実装は保留
//  fetchUrl(ralativeToAbsolutePath(d.src))

// const relToAbsPath = (url = "") =>
//   url.startsWith("http")
//     ? url
//     : url.replace("./", "https://maps.gsi.go.jp/layers_txt/");

// export const fetchUrl = (url) =>
//   fetch(relToAbsPath(url))
//     .then((response) => {
//       if (!response.ok) {
//         throw new Error("Network response was not ok");
//       }
//       return response.json();
//     })
//     .then((data) => data.layers)
//     .catch((error) => console.error("Error:", error));
