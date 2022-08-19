import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
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
import Reserve from "pages/Reserve";
import Claim from "pages/Claim";

import Header from "./components/Header";
import Footer from "./components/Footer";
import useLogInWallet from "./hooks/useLogInWallet";
import { SentryErrorBoundaryWithFallback } from "utils/sentry";
import { AppProvider } from "contexts/app";

const ME_QUERY = gql`
  query me {
    me {
      id
      address
    }
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
  appContainer: {
    display: "flex",
    minHeight: "100vh",
    flexDirection: "column"
  },
  appContent: {
    flex: 1,
  }
};

export default function App() {
  const { isLoggedIn } = useLogInWallet();
  const { data, loading, refetch, error } = useQuery(ME_QUERY);

  const onlyLoggedInPage = (Page) => {
    if (loading) {
      return (
        <Box sx={styles.center}>
          <CircularProgress />
        </Box>
      );
    }

    if (!isLoggedIn && !data?.me?.address) {
      return <Login data={data} loading={loading} error={error} refetch={refetch} />;
    }

    return <Page />;
  };

  return (
    <Router>
      <Box sx={styles.appContainer}>
        <ThemeProvider theme={theme}>
          <AppProvider>
            <Header />
              <Box sx={styles.appContent}>
                <SentryErrorBoundaryWithFallback>
                  <Routes>
                    <Route path="/s/:id" element={<Artist />} />
                    <Route path="/reserve" element={<Reserve />}/>
                    <Route path="/reserve/:handle" element={<Reserve />}/>
                    <Route path="/claim/:handle" element={<Claim />}/>
                    <Route path="/:username" element={<Artist />} />
                    <Route
                      path="/account/posts"
                      element={onlyLoggedInPage(ArtistPost)}
                    />
                    <Route
                      path="/account/new"
                      element={onlyLoggedInPage(CreateArtist)}
                    />
                    <Route
                      path="/account/new/:handle"
                      element={onlyLoggedInPage(CreateArtist)}
                    />
                    <Route path="/account/nfts" element={onlyLoggedInPage(NFTs)} />
                    <Route
                      path="/account/settings"
                      element={onlyLoggedInPage(Settings)}
                    />
                    <Route path="/" element={<Homepage />} />
                    <Route
                      path="/account/login"
                      element={<Login data={data} loading={loading} error={error} refetch={refetch} />}
                    />
                    <Route
                      path="/account/login-callback"
                      exact
                      element={<Callback refetch={refetch} />}
                    />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </SentryErrorBoundaryWithFallback>
              </Box>
            <Footer />
          </AppProvider>
        </ThemeProvider>
      </Box>
    </Router>
  );
}
