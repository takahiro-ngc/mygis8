import React from "react";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";

export const SyncSwitch = React.memo(
  ({ isSync, setIsSync, viewState, setViewStateForSub }) => {
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
              left: 0;
              right: 0;
              margin: auto;
              margin-top: 8px;
              width: fit-content;
              border-radius: 4px;
              padding-left: 16px;
            }
          `}
        </style>
      </div>
    );
  }
);
