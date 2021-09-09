import { EditableGeoJsonLayer } from "@nebula.gl/layers";
import { useState } from "react";

export const editableLayer = (feature, modeOfEdit) => {
  const [features, setFeatures] = useState({
    type: "FeatureCollection",
    features: [],
  });
  const [selectedFeatureIndexes] = useState([]);
  const canSelectFeature =
    modeOfEdit?.id === "TransformMode" || modeOfEdit?.id === "DeleteMode";
  return new EditableGeoJsonLayer({
    id: "EditableGeoJson",
    data: features,
    mode: modeOfEdit?.handler,
    selectedFeatureIndexes,
    // selectedFeatureIndexes: canSelectFeature
    //   ? [
    //       feature?.layer?.id === "EditableGeoJson" &&
    //         !feature?.isGuide &&
    //         feature.index,
    //     ]
    //   : [null],
    onEdit: ({ updatedData }) => {
      setFeatures(updatedData);
      // console.log(feature);
    },
    pickable: true,
    autoHighlight: true,
    highlightColor:
      modeOfEdit?.id === "DeleteMode" ? [255, 0, 0, 128] : [0, 0, 128, 128],
    // ToDO deleteButton
    // const delete=(index)=>...
    // onClick: d=>delete(d.index)
    // selectedFeatureIndexes: [
    //   feature?.layer?.id === "EditableGeoJson" &&
    //     modeOfEdit?.id === "DeleteMode" &&
    //     feature.index,
    // ],
    // onClick: (d) => modeOfEdit?.id === "DeleteMode" ?,
  });
};
