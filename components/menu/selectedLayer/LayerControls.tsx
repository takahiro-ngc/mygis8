// https://github.com/shimizu/learning-vis-academy/blob/master/Building-a-geospatial-app/2-scatterplot-overlay/src/controls.js
import Switch from "@material-ui/core/Switch";
import Slider from "@material-ui/core/Slider";
import GL from "@luma.gl/constants";
// import {
//   getFileTypeCategory,
//   isBitmap,
// } from "../../../../mygis4/utils/utility";

export default function LayerControls({ index, layers, setLayers }) {
  const changeSetting = (key, newValue) =>
    setLayers((prev) => {
      const newSettings = [...prev];
      const oldValue = prev[index][key];
      const canMerge =
        typeof oldValue === "object" && typeof newValue === "object";
      console.log("canMerge", canMerge);
      newSettings[index][key] = canMerge
        ? {
            ...oldValue,
            ...newValue,
          }
        : newValue;
      console.log("newSettings", newSettings);
      return newSettings;
    });

  const defaultProps = { visible: true, opacity: 1, parameters: null };
  const getCurrentValue = (propName: string) =>
    layers[index][propName] ?? defaultProps[propName];
  return (
    <>
      {/* 共通 */}
      {/* <List dense> */}
      <div className="style" key="visible">
        表示/一時非表示
        <Switch
          checked={getCurrentValue("visible")}
          onChange={() => changeSetting("visible", !getCurrentValue("visible"))}
        />
      </div>

      <div className="style">
        合成（下層レイヤーの透過）
        <BlendControl
          index={index}
          changeSetting={changeSetting}
          layers={layers}
          setLayers={setLayers}
        ></BlendControl>
      </div>

      <div className="style">
        不透明度
        <Slider
          valueLabelDisplay="auto"
          min={0}
          max={1}
          step={1 / 100}
          value={getCurrentValue("opacity")}
          onChange={(event, newValue) => changeSetting("opacity", newValue)}
        />
      </div>

      <div className="style">
        ターゲット
        <Slider
          valueLabelDisplay="auto"
          min={0}
          max={255}
          step={1 / 10}
          value={layers[index].target[0]}
          onChange={(event, newValue) =>
            changeSetting("target", [newValue, 0, 0, 255])
          }
        />
      </div>

      <style jsx>
        {`
          .style {
            display: grid;
            grid-template-columns: 50% 50%;
            align-items: center;
            overflow-x: hidden;
          }
        `}
      </style>
    </>
  );
}

const BlendControl = ({ index, changeSetting, layers, setLayers }) => {
  const MULTIPLY = [GL.ZERO, GL.SRC_COLOR];
  const currentValue = layers[index]?.parameters?.blendFunc;

  // const isBlend = currentValue === MULTIPLY;
  // const setBlend = () => {
  //   changeSetting("parameters", { blendFunc: MULTIPLY });
  //   changeSetting("transparentColor", [255, 255, 255, 255]);
  // };
  // const removeBlend = () =>
  //   setLayers((prev) => {
  //     let newSetting = [...prev];
  //     delete newSetting[index].parameters.blendFunc;
  //     delete newSetting[index].transparentColor;
  //     return newSetting;
  //   });
  // const toggle = isBlend ? removeBlend : setBlend;

  const toggleBlend = () => {
    if (currentValue === undefined) {
      changeSetting("parameters", {
        blendFunc: MULTIPLY,
      });

      // 合成すると火山等の一部領域データの外周の透明部分が黒くなってしまうため，透明部分を白に着色して防ぐ
      // https://blog.chocolapod.net/momokan/entry/23
      // ToDo バグ修正
      changeSetting("transparentColor", [255, 255, 255, 255]);
    } else {
      setLayers((prev) => {
        let newSetting = [...prev];
        delete newSetting[index].parameters.blendFunc;
        delete newSetting[index].transparentColor;
        return newSetting;
      });
    }
  };

  return (
    <Switch checked={Boolean(currentValue)} onChange={() => toggleBlend()} />
  );
};
