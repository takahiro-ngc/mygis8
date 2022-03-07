import React, { useState, useEffect, useLayoutEffect } from "react";
import { Select } from "@mui/material";
import { MenuItem } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import { useLayers } from "../../../../hooks/useLayers";

const TextControl = ({ layer, index }) => {
  const changeLayerProps = useLayers((state) => state.changeLayerProps);
  const features = useLayers((state) => state.loadedFeature[layer.id]);
  const textList = Object.keys(features?.[0]?.properties ?? {});
  const textItem = layer?.TextItemName;

  // Hack テキストの表示項目を切替えた際，textCharacterSet:"auto"が新しい文字を認識しないため，
  // updateTriggers: "all"にしておいて，useEffectで無理矢理TextLayerを更新した後，updateTriggersをリセット
  useEffect(() => {
    const interval = setInterval(() => {
      changeLayerProps(index, {
        updateTriggers: {},
      });
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const handleText = (e) => {
    changeLayerProps(index, {
      getText: (f) => f.properties[e.target.value],
      TextItemName: e.target.value,
      updateTriggers: true,
    });
  };

  return (
    <FormControl fullWidth variant="standard">
      <Select value={textItem} onChange={handleText}>
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
