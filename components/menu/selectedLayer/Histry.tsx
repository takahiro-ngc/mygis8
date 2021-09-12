import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";

import Button from "@material-ui/core/Button";
import { findLayer } from "../../layer/layerList";
import { Typography } from "@material-ui/core";
import ListItemText from "@material-ui/core/ListItemText";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";

export default function Histry({ layers, addLayer, storedHistry, setHistry }) {
  const histryList = storedHistry.map((id) => {
    const layer = findLayer(id);
    const category = layer?.category.map((d) => `${d} >`);
    return (
      <ListItem button onClick={() => addLayer(id)} key={id}>
        <ListItemText>
          <Typography variant="caption" component="p" color="textSecondary">
            {category}
          </Typography>
          <Typography variant="body1" component="p">
            {layer?.title}
          </Typography>
        </ListItemText>
      </ListItem>
    );
  });
  return (
    <>
      {histryList.length === 0 ? (
        <Typography variant="body1" component="p">
          履歴はありません。
        </Typography>
      ) : (
        <>
          <Typography variant="h6" component="h1">
            履歴
          </Typography>
          <List dense>{histryList}</List>
          <Button
            size="small"
            variant="outlined"
            onClick={() => setHistry([])}
            style={{ float: "right" }}
            startIcon={<DeleteOutlineIcon />}
          >
            履歴の削除
          </Button>
        </>
      )}
    </>
  );
}
