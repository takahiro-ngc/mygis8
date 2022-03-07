import { isImage } from "../../utils/utility";

export const addPropsForGsiLayer = ({
  url,
  minZoom = 0,
  maxZoom = null,
  maxNativeZoom = null,
  iconUrl = null,
}) => {
  return {
    data: url,

    // タイル用
    // 記載漏れや混同が多いよう。次のように設定すると，とりあえずうまくいく。
    minZoom: Math.min(minZoom, maxNativeZoom),
    maxZoom: isImage(url)
      ? maxNativeZoom || maxZoom
      : maxNativeZoom || minZoom || 2, //maxZoomではないので注意。2がデフォルト。

    // デバッグ用
    minZoomOriginal: minZoom,
    maxZoomOriginal: maxZoom,
    maxNativeZoomOriginal: maxNativeZoom,

    // アイコン用
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
    getPointRadius: (d) => {
      const src = d.properties;
      return src?._iconUrl || src?.icon || iconUrl ? 0 : 5; //iconがある時は点を小さくして隠す
    },
  };
};
