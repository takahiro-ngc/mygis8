import { Typography } from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import IconButton from "@material-ui/core/IconButton";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import TextField from "@material-ui/core/TextField";
import SearchIcon from "@material-ui/icons/Search";

const Header = ({
  setIsSearchVisible,
  filterWord,
  setFilterWord,
  isSearchVisible,
  setIsMenuVisible,
  isMainView,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setFilterWord(event.target.value);
  return (
    <div
      style={{
        display: "flex",
      }}
    >
      <Typography variant="h6" component="h2" display="inline">
        地図の種類
      </Typography>
      <IconButton
        size="small"
        onClick={() => {
          setIsSearchVisible((prev) => !prev);
          setFilterWord("");
        }}
      >
        {<SearchIcon />}
      </IconButton>
      {isSearchVisible && (
        <TextField
          autoFocus
          onChange={handleChange}
          value={filterWord}
          style={{ flex: 1 }}
        />
      )}
      <IconButton
        size="small"
        onClick={() => setIsMenuVisible(false)}
        style={{ marginLeft: "auto" }}
      >
        {isMainView ? <ArrowBackIcon /> : <ArrowForwardIcon />}
      </IconButton>
    </div>
  );
};

export default Header;
