import React from "react";
import Switch from "@mui/material/Switch";
import GL from "@luma.gl/constants";
import { useLayers } from "../../../../hooks/useLayers";

const BlendControl = ({ index, layer }) => {
  const MULTIPLY = [GL.ZERO, GL.SRC_COLOR];
  const currentValue = layer?.parameters?.blendFunc;
  // 配列の比較はJSON.stringifyが必要
  const isBlend = JSON.stringify(currentValue) === JSON.stringify(MULTIPLY);
  const defaultParameters = { depthTest: false };
  const changeLayerProps = useLayers((state) => state.changeLayerProps);
  const setBlend = () =>
    changeLayerProps(index, {
      // 火山レイヤーなどで，外周部が見えなくなるのを防ぐ
      transparentColor: [255, 255, 255, 255],
      parameters: { ...defaultParameters, blendFunc: MULTIPLY },
    });

  const removeBlend = () =>
    changeLayerProps(index, {
      transparentColor: [0, 0, 0, 0],
      parameters: defaultParameters,
    });

  const toggleBlend = isBlend ? removeBlend : setBlend;

  return <Switch edge="start" checked={isBlend} onChange={toggleBlend} />;
};

export default React.memo(BlendControl);
