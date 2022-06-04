import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Box, CircularProgress, Container, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { gql, useQuery } from "@apollo/client";

import Artist from "./pages/Artist";
import ArtistSearch from "./pages/ArtistSearch";
import Demo from "./pages/Demo";
import ArtistPost from "./pages/ArtistPost";
import CreateArtist from "./pages/CreateArtist";
import ArtistProfile from "./pages/ArtistProfile";

import Header from "./components/Header";
import Footer from "./components/Footer";

import useWeb3Modal from "./hooks/useWeb3Modal";

const DEV = process.env.NODE_ENV === "development";

const ME_QUERY = gql`
    query {
        dbMe {
            id
            address
        }
    }
`;

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

const styles = {
  loadingSpinner: {
    display: "flex",
    justifyContent: "center",
  },
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    // logErrorToMyService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <Typography variant="h1">Something went wrong.</Typography>;
    }

    return this.props.children;
  }
}

export default function App() {
  const { account } = useWeb3Modal();
  const { data, loading } = useQuery(ME_QUERY);

  const isLoggedIn = account && data?.dbMe?.address && account === data?.dbMe?.address;

  // TODO FIX NEEDED
  // it takes some time to load connected metamask account and when
  // it's loaded after graphql data are received it can cause redirection
  // from isLoggedIn restricted pages

  // if (DEV && window.location.pathname.startsWith("/demo")) {
  if (window.location.pathname.startsWith("/demo")) {
    return (
      <div className="app">
        <ThemeProvider theme={theme}>
          <Demo />
        </ThemeProvider>
      </div>
    );
  }

  return (
    <Router>
      <div className="app">
        <ThemeProvider theme={theme}>
          <Header />
            <ErrorBoundary>
              {loading ? (
                  <Container maxWidth="md">
                    <Box sx={styles.loadingSpinner}>
                      <CircularProgress />
                    </Box>
                  </Container>
                ) : (
                  <Routes>
                    <Route path="/s/:id" element={<Artist />}/>
                    <Route path="/post" element={isLoggedIn ? <ArtistPost/> : <Navigate to="/" />}/>
                    <Route path="/new-artist" element={isLoggedIn ? <CreateArtist/> : <Navigate to="/" />}/>
                    <Route path="/profile" element={isLoggedIn ? <ArtistProfile/> : <Navigate to="/" />}/>
                    <Route path="/" element={<ArtistSearch/>}/>
                    <Route path="*" element={<Navigate to="/" />}/>
                  </Routes>
              )}
            </ErrorBoundary>
          <Footer />
        </ThemeProvider>
      </div>
    </Router>
  );
}
