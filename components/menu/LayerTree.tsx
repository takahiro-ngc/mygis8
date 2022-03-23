import React, { useCallback } from "react";
import SimpleBar from "simplebar-react";

import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import TreeItem from "@mui/lab/TreeItem";
import TreeView from "@mui/lab/TreeView";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { useLayers } from "../../hooks/useLayers";
import LayerInfo from "../commonUI/LayerInfo";
import PopoverButton from "../commonUI/PopoverButton";
import { layerList } from "../layer/layerList";

const LayerTree = () => {
  const { toggleLayer } = useLayers();
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
