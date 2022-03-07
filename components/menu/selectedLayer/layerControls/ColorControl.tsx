import React, { useState } from "react";
import ColorSwatch from "./ColorSwatch";
import PopoverButton from "../../../commonUI/PopoverButton";
import { SketchPicker } from "react-color";
import { hex2rgb } from "../../../utils/utility";
import { rgb2hex } from "../../../utils/utility";
import { useLayers } from "../../../../hooks/useLayers";

const ColorControl = ({ layer, index, targetProp }) => {
  const defaultColor = [255, 255, 255]; //ToDo
  const currentColor = layer?.[targetProp];
  const hex = Array.isArray(currentColor)
    ? rgb2hex(currentColor)
    : defaultColor;
  const [color, setColor] = useState(hex);
  const changeLayerProps = useLayers((state) => state.changeLayerProps);
  const handleColor = (color) => {
    setColor(color.hex);
    changeLayerProps(index, {
      [targetProp]: hex2rgb(color.hex),
      updateTriggers: { [targetProp]: true },
    });
  };
  return (
    <PopoverButton button={<ColorSwatch color={color} />} width="fit-content">
      <SketchPicker color={color} onChange={handleColor} disableAlpha />
    </PopoverButton>
  );
};

export default React.memo(ColorControl);
