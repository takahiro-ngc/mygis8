import React, { useState, useEffect } from "react";
import { Select } from "@mui/material";
import { MenuItem } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import { useLayers } from "../../../../hooks/useLayers";

const TextControl = ({ layer, index }) => {
  const changeLayerProps = useLayers((state) => state.changeLayerProps);
  const features = useLayers((state) => state.loadedFeature[layer.id]);

  const textList = Object.keys(features?.[0]?.properties ?? {});
  const [text, setText] = useState(textList[0]);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     changeLayerProps(index, {
  //       pointType: "text",
  //     });
  //   }, 1000);
  //   return () => clearInterval(interval);
  // }, [layer.pointType]);

  // useEffect(() => {
  //   changeLayerProps(index, {
  //     pointType: "text",
  //   });
  // }, [text]);

  // ToDo テキスト更新がおかしい
  const handleText = (e) => {
    setText(e.target.value);

    changeLayerProps(index, {
      getText: (f) => f.properties[e.target.value],
      pointType: "",
      updateTriggers: { getText: e.target.value, pointType: true },
    });
  };

  return (
    <FormControl fullWidth variant="standard">
      <Select value={text} onChange={handleText}>
        {textList.map((d) => (
          <MenuItem key={d} value={d}>
            {d}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default React.memo(TextControl);
