// import React, { useState } from "react";

// import { Box, FormControl, IconButton, Typography } from "@mui/material";
// import { Button } from "@mui/material/";
// import PopoverButton from "./commonUI/PopoverButton";
// import { RadioGroup } from "@mui/material";
// import { Radio } from "@mui/material";
// import { FormControlLabel } from "@mui/material";
// import { useLayers } from "../hooks/useLayers";
// import { addDefaultProps } from "./layer/addDefaultProps";
// import { ToggleButtonGroup } from "@mui/material";
// import { ToggleButton } from "@mui/material";
// import SimpleBar from "simplebar-react";
// import "simplebar/dist/simplebar.min.css";
// import { isEditingCondition } from "../components/utils/utility";
// import List from "@mui/material/List";
// import ListItemButton from "@mui/material/ListItemButton";

// import {
//   EditableGeoJsonLayer,
//   SelectionLayer,
//   ModifyMode,
//   ResizeCircleMode,
//   TranslateMode,
//   TransformMode,
//   ScaleMode,
//   RotateMode,
//   DuplicateMode,
//   ExtendLineStringMode,
//   SplitPolygonMode,
//   ExtrudeMode,
//   ElevationMode,
//   DrawPointMode,
//   DrawLineStringMode,
//   DrawPolygonMode,
//   DrawRectangleMode,
//   DrawSquareMode,
//   DrawRectangleFromCenterMode,
//   DrawSquareFromCenterMode,
//   DrawCircleByDiameterMode,
//   DrawCircleFromCenterMode,
//   DrawEllipseByBoundingBoxMode,
//   DrawEllipseUsingThreePointsMode,
//   DrawRectangleUsingThreePointsMode,
//   Draw90DegreePolygonMode,
//   DrawPolygonByDraggingMode,
//   MeasureDistanceMode,
//   MeasureAreaMode,
//   MeasureAngleMode,
//   ViewMode,
//   CompositeMode,
//   SnappableMode,
//   ElevatedEditHandleLayer,
//   PathMarkerLayer,
//   SELECTION_TYPE,
//   GeoJsonEditMode,
// } from "nebula.gl";

// const Edit = () => {
//   const changeLayerProps = useLayers((state) => state.changeLayerProps);
//   const toggleIsEditing = useLayers((state) => state.toggleIsEditing);
//   const layers = useLayers((state) => state.layers);
//   const isEditing = useLayers((state) => state.layers.some(isEditingCondition));

//   const getIsEditing = useLayers((state) => state.getIsEditing);
//   const ableEdit = useLayers((state) => state.ableEdit);
//   const disableEdit = useLayers((state) => state.disableEdit);
//   const addEditableLayer = useLayers((state) => state.addEditableLayer);
//   const toggleEdit = getIsEditing()
//     ? () => disableEdit()
//     : () => {
//         addEditableLayer();
//         ableEdit(0);
//       };

//   const ALL_MODES: any = [
//     {
//       category: "終了",
//       modes: [{ label: "終了", mode: ViewMode }],
//     },
//     {
//       category: "Draw",
//       modes: [
//         { label: "点", mode: DrawPointMode },
//         { label: "線", mode: DrawLineStringMode },
//         { label: "多角形", mode: DrawPolygonMode },
//         { label: "直角図形", mode: Draw90DegreePolygonMode },
//         { label: "フリー", mode: DrawPolygonByDraggingMode },
//         { label: "長方形", mode: DrawRectangleMode },
//         { label: "正方形", mode: DrawSquareMode },
//         { label: "円", mode: DrawCircleByDiameterMode },
//         {
//           label: "楕円",
//           mode: DrawEllipseByBoundingBoxMode,
//         },
//       ],
//     },
//     {
//       category: "編集",
//       modes: [
//         { label: "編集", mode: ModifyMode },
//         { label: "複製", mode: DuplicateMode },
//         { label: "変形", mode: new SnappableMode(new TransformMode()) },
//       ],
//     },
//   ];
//   const modes1 = [{ label: "終了", mode: ViewMode }];

//   const modes2 = [
//     {
//       label: "距離",
//       mode: MeasureDistanceMode,
//     },
//     { label: "面積", mode: MeasureAreaMode },
//     { label: "角度", mode: MeasureAngleMode },
//   ];
//   const modes3 = [
//     { label: "点", mode: DrawPointMode },
//     { label: "線", mode: DrawLineStringMode },
//     { label: "多角形", mode: DrawPolygonMode },
//     { label: "直角図形", mode: Draw90DegreePolygonMode },
//     { label: "フリー", mode: DrawPolygonByDraggingMode },
//     { label: "長方形", mode: DrawRectangleMode },
//     { label: "正方形", mode: DrawSquareMode },
//     { label: "円", mode: DrawCircleByDiameterMode },
//     {
//       label: "楕円",
//       mode: DrawEllipseByBoundingBoxMode,
//     },
//   ];
//   const modes4 = [
//     { label: "編集", mode: ModifyMode },
//     { label: "複製", mode: DuplicateMode },
//     { label: "変形", mode: new SnappableMode(new TransformMode()) },
//   ];
//   const currentMode = layers[0].mode;
//   const handleChange = (mode) => changeLayerProps(0, { mode: mode });

//   const Title = ({ children }) => (
//     <Typography variant="subtitle2" color="primary" padding={1} paddingTop={2}>
//       {children}
//     </Typography>
//   );
//   return (
//     <SimpleBar
//       hidden={!isEditing}
//       style={{
//         position: "absolute",
//         top: 0,
//         right: 0,
//         width: "100px",
//         height: "100%",
//         zIndex: 2,
//       }}
//     >
//       <Box
//         sx={{
//           backgroundColor: "background.default",
//           // padding: 1,
//         }}
//       >
//         {ALL_MODES.map((category) => (
//           <>
//             <Title>{category.category}</Title>

//             <List disablePadding>
//               {category.modes.map((mode) => (
//                 <ListItemButton
//                   selected={mode.mode === currentMode}
//                   onClick={() => handleChange(mode.mode)}
//                   // disableGutters
//                 >
//                   {mode.label}
//                 </ListItemButton>
//               ))}
//             </List>
//           </>
//         ))}

//         {/* <ToggleButton
//           value={modes1[0].mode}
//           sx={{ height: "40px", marginBottom: 2, backgroundColor: "primary" }}
//           fullWidth
//           onClick={toggleIsEditing}
//         >
//           {modes1[0].label}
//         </ToggleButton> */}
//         {/* <Typography
//           variant="subtitle2"
//           color="primary"
//           sx={{ marginBottom: 1 }}
//         >
//           計測
//         </Typography>
//         <ToggleButtonGroup
//           orientation="vertical"
//           // value={currentMode}
//           exclusive
//           // onChange={(e) => handleChange(e.target.value)}
//           color="primary"
//           fullWidth
//           sx={{ marginBottom: 2 }}
//         >
//           {modes2.map((mode) => (
//             <ToggleButton
//               value={mode.mode}
//               selected={mode.mode === currentMode}
//               sx={{ height: "40px" }}
//               onChange={() => handleChange(mode.mode)}
//             >
//               {mode.label}
//             </ToggleButton>
//           ))}
//         </ToggleButtonGroup> */}
//         {/* <Typography
//           variant="subtitle2"
//           color="primary"
//           sx={{ marginBottom: 1 }}
//         >
//           作図
//         </Typography>
//         <ToggleButtonGroup
//           orientation="vertical"
//           value={currentMode}
//           exclusive
//           onChange={(e) => handleChange(e.target.value)}
//           color="primary"
//           fullWidth
//           sx={{ marginBottom: 2 }}
//         >
//           {modes3.map((mode) => (
//             <ToggleButton value={mode.mode} sx={{ height: "40px" }}>
//               {mode.label}
//             </ToggleButton>
//           ))}
//         </ToggleButtonGroup>

//         <Typography
//           variant="subtitle2"
//           color="primary"
//           sx={{ marginBottom: 1 }}
//         >
//           編集
//         </Typography>
//         <ToggleButtonGroup
//           orientation="vertical"
//           value={currentMode}
//           exclusive
//           onChange={(e) => handleChange(e.target.value)}
//           color="primary"
//           fullWidth
//           sx={{ marginBottom: 1 }}
//         >
//           {modes4.map((mode) => (
//             <ToggleButton value={mode.mode} sx={{ height: "40px" }}>
//               {mode.label}
//             </ToggleButton>
//           ))}
//         </ToggleButtonGroup> */}

//         {/* <Button onClick={() => add(new Date().toLocaleTimeString() + "の作図")}>
//         edit開始
//       </Button> */}
//         {/* <FormControl>
//         <RadioGroup onChange={handleChange} value={currentMode}>
//           {Object.keys(mode).map((item) => (
//             <FormControlLabel value={item} control={<Radio />} label={item} />
//           ))}
//         </RadioGroup>
//       </FormControl> */}
//       </Box>
//     </SimpleBar>
//   );
// };

// export default React.memo(Edit);
