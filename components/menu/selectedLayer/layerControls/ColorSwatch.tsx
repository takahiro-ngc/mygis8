import React from "react";

const ColorSwatch = ({ color }) => {
  return (
    <div
      style={{
        height: "24px",
        width: "48px",
        background: color,
        borderRadius: "1px",
        border: "1px solid white",
        display: "inline-block",
        cursor: "pointer",
      }}
    ></div>
  );
};

export default React.memo(ColorSwatch);
