import React, { useState } from "react";
import Switch from "@mui/material/Switch";
import Slider from "@mui/material/Slider";
import { Button, ButtonBase, Stack, Typography } from "@mui/material";
import { useLayers } from "../../../../hooks/useLayers";
import FormControlLabel from "@mui/material/FormControlLabel";
import { FormGroup } from "@mui/material";
import { Checkbox } from "@mui/material";
import BlendControl from "./BlendControl";
import TextControl from "./TextControl";
import ColorControl from "./ColorControl";

const Item = ({ children, label }) => (
  <Stack spacing={2} direction="row" alignItems="center" height="34px">
    <div style={{ width: "25%" }}>{label}</div>
    <div style={{ paddingRight: "8px", width: "75%" }}>{children}</div>
  </Stack>
);

const LayerControls = ({ index }) => {
  const defaultProps = {
    visible: true,
    parameters: null,
    getLineWidth: 3,
  };
  const layer = useLayers((state) => state.layers[index]);
  const features = useLayers((state) => state.loadedFeature[layer.id]);

  const changeLayerProps = useLayers((state) => state.changeLayerProps);
  const visible = layer?.visible ?? defaultProps.visible;
  const hasPoint = features?.some((d) => d?.geometry?.type === "Point");

  const style = { width: "20%" };

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
    <>
      <Typography variant="subtitle2" color="primary">
        全般
      </Typography>
      <Item label="一時非表示">
        <Switch
          edge="start"
          checked={!visible}
          onChange={() => changeLayerProps(index, { visible: !visible })}
        />
      </Item>

      <Item label="合成">
        <BlendControl index={index} layer={layer}></BlendControl>
      </Item>

      <Item label="タイプ">
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
      </Item>

      <Typography variant="subtitle2" color="primary" sx={{ marginTop: 2 }}>
        点
      </Typography>

      <Item label="大きさ">
        <Slider
          valueLabelDisplay="auto"
          min={0}
          max={10}
          step={0.1}
          value={layer.getPointRadius}
          onChange={(e, newValue) => {
            changeLayerProps(index, {
              getPointRadius: newValue,
              updateTriggers: { getPointRadius: true },
            });
          }}
          size="small"
        />
      </Item>
      <Item label="色">
        <ColorControl layer={layer} index={index} targetProp="getFillColor" />
      </Item>

      <Typography variant="subtitle2" color="primary" sx={{ marginTop: 2 }}>
        テキスト
      </Typography>

      <Item label="表示項目">
        <TextControl layer={layer} index={index} />
      </Item>

      <Item label="位置"></Item>

      <Item label="大きさ">
        <Slider
          valueLabelDisplay="auto"
          min={0}
          max={40}
          step={1}
          value={layer.getTextSize}
          onChange={(e, newValue) => {
            changeLayerProps(index, {
              getTextSize: newValue,
              updateTriggers: { getTextSize: true },
            });
          }}
          size="small"
        />
      </Item>

      <Typography variant="subtitle2" color="primary" sx={{ marginTop: 2 }}>
        線
      </Typography>
      <Item label="大きさ">
        <Slider
          valueLabelDisplay="auto"
          min={0}
          max={10}
          step={0.1}
          value={layer.getLineWidth ?? defaultProps.getLineWidth}
          onChange={(e, newValue) => {
            changeLayerProps(index, {
              getLineWidth: newValue,
              updateTriggers: { getLineWidth: true },
            });
          }}
          size="small"
        />
      </Item>

      <Item label="色">
        <ColorControl layer={layer} index={index} targetProp="getLineColor" />
      </Item>
    </>
  );
};

export default React.memo(LayerControls);
