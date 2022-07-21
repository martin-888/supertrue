import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
} from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Box, CircularProgress } from "@mui/material";
import { grey } from "@mui/material/colors";

import Artist from "./pages/Artist";
import Homepage from "./pages/Homepage";
import ArtistPost from "./pages/ArtistPost";
import CreateArtist from "./pages/CreateArtist";
import Settings from "./pages/Settings";
import NFTs from "./pages/NFTs";
import NotFound from "./pages/NotFound";
import Callback from "pages/Login/Callback";
import Login from "pages/Login/Login";

import Header from "./components/Header";
import Footer from "./components/Footer";
import useLogInWallet from "./hooks/useLogInWallet";
import { SentryErrorBoundaryWithFallback } from "utils/sentry";
import { AppProvider } from "contexts/app";

const ME_QUERY = gql`
  query me {
    me { address }
  }
`;

const LinkRouter = React.forwardRef((props, ref) => {
  const { href, ...other } = props;
  // Map href (MUI) -> to (react-router)
  return <Link ref={ref} to={href} {...other} />;
});

const theme = createTheme({
  components: {
    MuiLink: {
      defaultProps: {
        component: LinkRouter,
      },
    },
    MuiButtonBase: {
      defaultProps: {
        LinkComponent: LinkRouter,
      },
    },
  },
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

const styles = {
  center: {
    display: "flex",
    justifyContent: "center",
    margin: "10em",
  },
};

export default function App() {
  const { isLoggedIn } = useLogInWallet();
  const { data, loading } = useQuery(ME_QUERY);

  const onlyLoggedInPage = (Page) => {
    if (loading) {
      return (
        <Box sx={styles.center}>
          <CircularProgress />
        </Box>
      );
    }

    if (!isLoggedIn && (!loading && !data?.me?.address)) {
      return <Navigate to="/" />;
    }

    return <Page />;
  };

  return (
    <Router>
      <div className="app">
        <ThemeProvider theme={theme}>
          <AppProvider>
            <Header/>
              <SentryErrorBoundaryWithFallback>
                <Routes>
                  <Route path="/s/:id" element={<Artist />} />
                  <Route path="/posts" element={onlyLoggedInPage(ArtistPost)} />
                  <Route path="/new" element={onlyLoggedInPage(CreateArtist)} />
                  <Route path="/nfts" element={onlyLoggedInPage(NFTs)} />
                  <Route path="/settings" element={onlyLoggedInPage(Settings)} />
                  <Route path="/" element={<Homepage />}/>
                  <Route path="/login" element={<Login />}/>
                  <Route path="/login-callback" exact element={<Callback />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </SentryErrorBoundaryWithFallback>
            <Footer />
          </AppProvider>
        </ThemeProvider>
      </div>
    </Router>
  );
}
