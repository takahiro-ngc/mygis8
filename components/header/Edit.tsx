import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem, { ListItemProps } from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { Button } from "@material-ui/core";

const Edit = ({ setModeOfEdit }) => (
  <>
    {modeList.map((d, index) => (
      <Button variant="outlined" onClick={() => setModeOfEdit(undefined)}>
        {d.text}
      </Button>
    ))}
  </>
);
export default Edit;
