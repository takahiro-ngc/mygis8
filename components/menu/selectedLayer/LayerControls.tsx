// https://github.com/shimizu/learning-vis-academy/blob/master/Building-a-geospatial-app/2-scatterplot-overlay/src/controls.js
import Switch from "@mui/material/Switch";
import Slider from "@mui/material/Slider";
import GL from "@luma.gl/constants";

export default function LayerControls({ index, layers, setLayers }) {
  const changeSetting = (key, newValue) =>
    setLayers((prev) => {
      const newSettings = [...prev];
      newSettings[index][key] = newValue;
      return newSettings;
    });

  const defaultProps = { visible: true, opacity: 1, parameters: null };
  const getCurrentValue = (propName: string) =>
    layers[index][propName] ?? defaultProps[propName];

  return (
    <>
      {/* 共通 */}
      {/* <List dense> */}
      {/* <div className="style" key="test">
        test
        <Switch
          checked={getCurrentValue("test")}
          onChange={() => changeSetting("test", !getCurrentValue("test"))}
        />
      </div> */}
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

      {/* <div className="style">
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
      </div> */}

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
  const isBlend = Boolean(currentValue);

  const setBlend = () => {
    changeSetting("transparentColor", [255, 255, 255, 255]);
    setLayers((prev) => {
      const newSetting = [...prev];
      newSetting[index].parameters.blendFunc = MULTIPLY;
      return newSetting;
    });
  };
  const removeBlend = () =>
    setLayers((prev) => {
      const newSetting = [...prev];
      delete newSetting[index].parameters.blendFunc;
      delete newSetting[index].transparentColor;
      return newSetting;
    });
  const toggleBlend = isBlend ? removeBlend : setBlend;

  return <Switch checked={isBlend} onChange={toggleBlend} />;
};
