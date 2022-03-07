import React from "react";
import Switch from "@mui/material/Switch";
import Slider from "@mui/material/Slider";
import { Stack, Typography } from "@mui/material";
import { useLayers } from "../../../../hooks/useLayers";
import FormControlLabel from "@mui/material/FormControlLabel";

import BlendControl from "./BlendControl";
import TextControl from "./TextControl";
import ColorControl from "./ColorControl";
import { Radio } from "@mui/material";
import { RadioGroup } from "@mui/material";
import PointTypeControl from "./PointTypeControl";

const Item = ({ children, label }) => (
  <Stack spacing={2} direction="row" alignItems="center" minHeight="34px">
    <div style={{ width: "25%" }}>{label}</div>
    <div style={{ paddingRight: "8px", width: "75%" }}>{children}</div>
  </Stack>
);

const LayerControls = ({ index }) => {
  const layer = useLayers((state) => state.layers[index]);
  const features = useLayers((state) => state.loadedFeature[layer.id]);

  const changeLayerProps = useLayers((state) => state.changeLayerProps);
  const visible = layer?.visible ?? true;
  const hasPoint = features?.some(
    (d) => d?.geometry?.type === "Point" || d?.geometry?.type === "MultiPoint"
  );
  const hasfeatures = !!features.length;

  const pixelOffset = layer?.getTextPixelOffset[1];
  const handlePixelOffset = (e) => {
    changeLayerProps(index, {
      getTextPixelOffset: [0, Number(e.target.value)],
    });
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

      <Item label="合成（透過）">
        <BlendControl index={index} layer={layer}></BlendControl>
      </Item>

      {hasPoint && (
        <>
          <Item label="表示種類">
            <PointTypeControl index={index} layer={layer} />
          </Item>

          <Typography variant="subtitle2" color="primary" sx={{ marginTop: 2 }}>
            テキスト
          </Typography>

          <Item label="表示項目">
            <TextControl layer={layer} index={index} />
          </Item>

          <Item label="表示位置">
            <RadioGroup row value={pixelOffset} onChange={handlePixelOffset}>
              <FormControlLabel
                value={0}
                control={<Radio size="small" />}
                label="中央"
              />
              <FormControlLabel
                value={20}
                control={<Radio size="small" />}
                label="下"
              />
            </RadioGroup>
          </Item>

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
            <ColorControl
              layer={layer}
              index={index}
              targetProp="getFillColor"
            />
          </Item>
        </>
      )}

      {hasfeatures && (
        <>
          <Typography variant="subtitle2" color="primary" sx={{ marginTop: 2 }}>
            線
          </Typography>
          <Item label="大きさ">
            <Slider
              valueLabelDisplay="auto"
              min={0}
              max={10}
              step={0.1}
              value={layer.getLineWidth}
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
            <ColorControl
              layer={layer}
              index={index}
              targetProp="getLineColor"
            />
          </Item>
        </>
      )}
    </>
  );
};

export default React.memo(LayerControls);
