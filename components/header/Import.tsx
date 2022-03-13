import React, { useState } from "react";

import ImportFile from "./ImportFile";
import ImportUrl from "./ImportUrl";

export default function Import() {
  return (
    <>
      <ImportUrl />
      <div style={{ margin: "24px" }} />
      <ImportFile />
    </>
  );
}
