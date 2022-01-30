import { createTheme } from "@mui/material/styles";

// Create a theme instance.
const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "rgba(20, 20, 20, .9)",
    },
    // primary: {
    //   main: "#556cd6",
    // },
    // secondary: {
    //   main: "#19857b",
    // },
    // error: {
    //   main: red.A400,
    // },
  },
});

export default theme;
