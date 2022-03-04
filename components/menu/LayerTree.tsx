import React from "react";

import { layerList } from "../layer/layerList";
import PopoverButton from "../commonUI/PopoverButton";
import LayerInfo from "../commonUI/LayerInfo";

import Stack from "@mui/material/Stack";
import TreeView from "@mui/lab/TreeView";
import TreeItem from "@mui/lab/TreeItem";

import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Typography from "@mui/material/Typography";
import SimpleBar from "simplebar-react";
import IconButton from "@mui/material/IconButton";
import { useLayers } from "../../hooks/useLayers";

const LayerTree = () => {
  const toggleLayer = useLayers((state) => state.toggleLayer);
  const renderTree = (nodes) =>
    nodes.map((node, index) => {
      const key = node.category + node.title + index;
      return (
        <TreeItem
          key={key}
          nodeId={key}
          onClick={() => node.data && toggleLayer(node.id)}
          label={
            <Stack direction="row" alignItems="center">
              <Typography sx={{ marginRight: "auto" }}>{node.title}</Typography>
              <PopoverButton
                button={
                  <IconButton size="small">
                    <InfoOutlinedIcon />
                  </IconButton>
                }
              >
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
        padding: 8,
        height: "100%",
      }}
    >
      {/* <Typography variant="h6" component="h2" display="inline">
        地図の種類
      </Typography> */}

      <TreeView
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
      >
        {renderTree(layerList)}
      </TreeView>
    </SimpleBar>
  );
};

export default React.memo(LayerTree);
