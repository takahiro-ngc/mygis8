import { BitmapLayer } from "@deck.gl/layers";

// ToDo 背景レイヤーがないときは，合成できないようにすれば？
// 背景レイヤーがないと，「合成」したときに見えなくなるのを防止
export const backgroundLayer = new BitmapLayer({
  title: "作図",
  id: "background-layer",
  bounds: [-180, -180, 180, 180],
  image: "/img/white.jpg",
  // 傾けたときにチラつくのを防止
  parameters: {
    depthTest: false,
  },
});
