import React from "react";

import { layerList } from "../layer/layerList";
import PopoverButton from "./PopoverButton";
import LayerInfo from "./LayerInfo";

import Stack from "@mui/material/Stack";
import TreeView from "@mui/lab/TreeView";
import TreeItem from "@mui/lab/TreeItem";

import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Typography from "@mui/material/Typography";
import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";

const DataCatalog = ({ setViewState, toggleLayers }) => {
  const renderTree = (nodes) =>
    nodes.map((node, index) => {
      const key = node.category + node.title + index;
      return (
        <TreeItem
          key={key}
          nodeId={key}
          onClick={() => node.data && toggleLayers(node.id)}
          label={
            <Stack direction="row" alignItems="center">
              <Typography sx={{ marginRight: "auto" }}>{node.title}</Typography>
              <PopoverButton icon={<InfoOutlinedIcon />}>
                <LayerInfo node={node} />
              </PopoverButton>
            </Stack>
          }
        >
          {node.entries && renderTree(node.entries)}
        </TreeItem>
      );
    });

  return (
    <SimpleBar
      style={{
        overflow: "auto", //無いと縦に伸びすぎる
        padding: "8px 0 8px 8px",
        height: "100%",
      }}
    >
      <Typography variant="h6" component="h2" display="inline">
        地図の種類
      </Typography>

      <TreeView
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
      >
        {renderTree(layerList)}
      </TreeView>
    </SimpleBar>
  );
};

export default React.memo(DataCatalog);
