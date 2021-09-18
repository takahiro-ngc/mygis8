import React from "react";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";

const SyncSwitch = ({ isSync, setIsSync, viewState, setViewStateForSub }) => {
  return (
    <div className="acrylic-color center">
      <FormControlLabel
        label="連動"
        control={
          <Switch
            checked={isSync}
            onChange={() => {
              setIsSync(!isSync);
              setViewStateForSub(viewState);
            }}
          />
        }
      />

      <style jsx>
        {`
          .center {
            position: absolute;
            top: 8px;
            transform: translate(-50%);
            margin-left: 50%;
            width: fit-content;
            border-radius: 4px;
            padding-left: 16px;
          }
        `}
      </style>
    </div>
  );
};

export default React.memo(SyncSwitch);
