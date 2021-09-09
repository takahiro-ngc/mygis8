import { EditableGeoJsonLayer } from "@nebula.gl/layers";
import { useState } from "react";

export const editableLayer = (feature, modeOfEdit) => {
  const [features, setFeatures] = useState({
    type: "FeatureCollection",
    features: [],
  });

  return new EditableGeoJsonLayer({
    id: "EditableGeoJson",
    data: features,
    mode: modeOfEdit?.handler,
    selectedFeatureIndexes: [
      feature?.layer?.id === "EditableGeoJson" &&
        modeOfEdit?.id === "TransformMode" &&
        !feature?.isGuide &&
        feature.index,
    ],
    onEdit: ({ updatedData }) => {
      setFeatures(updatedData);
      // console.log(feature);
    },
    pickable: true,
    autoHighlight: true,
    // ToDO deleteButton
    // const delete=(index)=>...
    // onClick: d=>delete(d.index)
    // selectedFeatureIndexes: [
    //   feature?.layer?.id === "EditableGeoJson" &&
    //     modeOfEdit?.id === "DeleteMode" &&
    //     feature.index,
    // ],
    // autoHighlightColor:modeOfEdit?.id === "DeleteMode" &&...
    // onClick: (d) => console.log("a", d),
  });
};
