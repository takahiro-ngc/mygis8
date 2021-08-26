import { setLayerProps, setProps, setPropsForGsi } from "../layerProps";

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

const addProps = (data) =>
  data.map((d) =>
    d.type === "Layer"
      ? {
          ...d,
          ...setProps(d.url),
          ...setPropsForGsi(
            d.url,
            d.minZoom,
            d.maxZoom,
            d.maxNativeZoom,
            d.iconUrl
          ),
        }
      : d.entries
      ? { ...d, entries: addProps(d.entries) }
      : d
  );
export const gsiLayers = addProps(layerList);

// d.srcの中身は，以下で確認できるが，データ数が多いため実装は保留
//  fetchUrl(ralativeToAbsolutePath(d.src))

// const fetchUrl = (url) =>
//   fetch(url)
//     .then((response) => {
//       if (!response.ok) {
//         throw new Error("Network response was not ok");
//       }
//       return response.json();
//     })
//     .then((data) => console.log(data))
//     .catch((error) => console.error("Error:", error));

// const ralativeToAbsolutePath = (url) =>
//   url.replace("./", "https://maps.gsi.go.jp/layers_txt/");
