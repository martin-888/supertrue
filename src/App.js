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
import { Box, CircularProgress, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { Magic } from 'magic-sdk';

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
  loadingSpinner: {
    display: "flex",
    justifyContent: "center",
    margin: "10em",
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
  const NETWORK = process.env.REACT_APP_NETWORK;
  const magic = new Magic(process.env.REACT_APP_MAGIC_KEY, { network: NETWORK });
  const { isLoggedIn } = useLogInWallet();
  const { data, loading } = useQuery(ME_QUERY);

  const onlyLoggedInPage = (Page) => {
    if (loading) {
      return (
        <Box sx={styles.loadingSpinner}>
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
          <Header magic={magic}/>
          <ErrorBoundary>
            <Routes>
              <Route path="/s/:id" element={<Artist />} />
              <Route path="/posts" element={onlyLoggedInPage(ArtistPost)} />
              <Route path="/new" element={onlyLoggedInPage(CreateArtist)} />
              <Route path="/nfts" element={onlyLoggedInPage(NFTs)} />
              <Route path="/settings" element={onlyLoggedInPage(Settings)} />
              <Route path="/" element={<Homepage />}/>
              <Route path="/login" element={<Login magic={magic} />}/>
              <Route path="/login-callback" exact element={<Callback magic={magic} />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ErrorBoundary>
          <Footer />
        </ThemeProvider>
      </div>
    </Router>
  );
}
