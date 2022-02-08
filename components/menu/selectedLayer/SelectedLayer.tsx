import React from "react";
import List from "@mui/material/List";
import Collapse from "@mui/material/Collapse";
import { TransitionGroup } from "react-transition-group";
import { List as ListReactMovable, arrayMove } from "react-movable";
import Title from "./Title";
import SelectedLayerItem from "./SelectedLayerItem";
import SimpleBar from "simplebar-react";
import { Typography } from "@mui/material";

import "simplebar/dist/simplebar.min.css";
const SelectedLayerList = ({
  layers,
  toggleLayers,
  setLayers,
  loadedData,
  setViewState,
}) => (
  <SimpleBar style={{ height: "100%", padding: "8px 0 8px 8px" }}>
    <Typography variant="h6" component="h2">
      選択中の地図
    </Typography>

    <ListReactMovable
      values={layers}
      onChange={({ oldIndex, newIndex }) =>
        setLayers(arrayMove(layers, oldIndex, newIndex))
      }
      renderList={({ children, props, isDragged }) => (
        <List
          {...props}
          style={{
            boxShadow: isDragged && "inset 0px 0px 8px white",
          }}
          disablePadding
        >
          {/* component={null}がないとドラッグが正常に動かない */}
          <TransitionGroup component={null}>{children}</TransitionGroup>
        </List>
      )}
      renderItem={({ value, props, index }) => (
        // key={value.id}でないのは，3D化のHackでIDが変わることがあるため
        <Collapse key={value.data} in={true} timeout={300}>
          <SelectedLayerItem
            value={value}
            props={props}
            index={index}
            toggleLayers={toggleLayers}
            layers={layers}
            setLayers={setLayers}
            // loadedData={loadedData}
            setViewState={setViewState}
          />
        </Collapse>
      )}
    />
  </SimpleBar>
);

export default React.memo(SelectedLayerList);
