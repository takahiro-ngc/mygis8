import React, { useState } from "react";
import { useLayers } from "../../../../hooks/useLayers";
import FormControlLabel from "@mui/material/FormControlLabel";
import { FormGroup } from "@mui/material";
import { Checkbox } from "@mui/material";

const PointTypeControl = ({ layer, index }) => {
  const changeLayerProps = useLayers((state) => state.changeLayerProps);

  const [pointTypeArray, setPointTypeArray] = useState(
    layer.pointType.split("+")
  );

  const togglePointType = (type: string) => {
    const addedType = [...pointTypeArray, type];
    const filtered = pointTypeArray.filter((d) => d !== type);
    const removedType = filtered;
    const toggledType = pointTypeArray.includes(type) ? removedType : addedType;
    changeLayerProps(index, {
      pointType: toggledType.join("+"),
      updateTriggers: { pointType: true },
    });
    setPointTypeArray(toggledType);
  };
  return (
    <FormGroup row>
      <FormControlLabel
        control={
          <Checkbox
            checked={pointTypeArray.includes("circle")}
            onChange={() => togglePointType("circle")}
            size="small"
          />
        }
        label="点"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={pointTypeArray.includes("icon")}
            onChange={() => togglePointType("icon")}
            size="small"
          />
        }
        label="アイコン"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={pointTypeArray.includes("text")}
            onChange={() => togglePointType("text")}
            size="small"
          />
        }
        label="テキスト"
      />
    </FormGroup>
  );
};

export default React.memo(PointTypeControl);
