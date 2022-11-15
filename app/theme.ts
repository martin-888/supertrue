import { createTheme } from "@mui/material/styles";
import { grey } from "@mui/material/colors";

const theme = createTheme({
  palette: {
    primary: {
      main: grey[900], //Black
    },
    secondary: {
      main: grey[50], //White
    },
  },
  typography: {
    fontFamily: ["Space Mono", '"Montserrat"', "Open Sans"].join(","),

    h1: {
      fontFamily: "DM Serif Display, serif",
      fontWeight: "bold",
      fontSize: "2rem",
    },
    h2: {
      fontFamily: "DM Serif Display, serif",
      fontWeight: "bold",
      fontSize: "1.8rem",
    },
    h3: {
      fontFamily: "DM Serif Display, serif",
      fontWeight: "bold",
      fontSize: "1.6rem",
    },
    h4: {
      fontFamily: "DM Serif Display, serif",
      fontWeight: "bold",
      fontSize: "1.4rem",
    },
    h5: {
      fontFamily: "DM Serif Display, serif",
      fontWeight: "bold",
      fontSize: "1.2rem",
    },
    h6: {
      fontFamily: "DM Serif Display, serif",
      fontWeight: "bold",
      fontSize: "1.1rem",
    },
  },
});

export default theme;
