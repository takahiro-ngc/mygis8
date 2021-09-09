// import { EditableGeoJsonLayer } from "@nebula.gl/layers";
// import { useState } from "react";

// export const EditableLayer = (feature, modeOfEdit) => {
//   const [features, setFeatures] = useState({
//     type: "FeatureCollection",
//     features: [],
//   });
//   const [selectedFeatureIndexes] = useState([]);
//   const canSelectFeature =
//     modeOfEdit?.id === "TransformMode" || modeOfEdit?.id === "DeleteMode";
//   return new EditableGeoJsonLayer({
//     id: "EditableGeoJson",
//     data: features,
//     mode: modeOfEdit?.handler,
//     selectedFeatureIndexes,
//     // selectedFeatureIndexes: canSelectFeature
//     //   ? [
//     //       feature?.layer?.id === "EditableGeoJson" &&
//     //         !feature?.isGuide &&
//     //         feature.index,
//     //     ]
//     //   : [null],
//     onEdit: ({ updatedData }) => {
//       setFeatures(updatedData);
//     },
//     pickable: true,
//     autoHighlight: true,
//     highlightColor:
//       modeOfEdit?.id === "DeleteMode" ? [255, 0, 0, 128] : [0, 0, 128, 128],
//   });
// };
