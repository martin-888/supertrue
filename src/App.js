import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Typography } from "@mui/material";
import { grey } from '@mui/material/colors';

// import Home from "./pages/Home";
import Artist from "./pages/Artist";
import NewArtist from "./pages/NewArtist";
import Profile from "./pages/Profile";
import ArtistSearch from "pages/ArtistSearch";

import Header from "./components/Header";
import Footer from "./components/Footer";

import 'App.scss';
import useWeb3Modal from "./hooks/useWeb3Modal";

const theme = createTheme({
  palette: {
    primary: {
      main: grey[900],  //Black
    },
    secondary: {
      main: grey[50],   //White
    }
  },
  typography: {
    fontFamily: ['Space Mono', '"Montserrat"', 'Open Sans'].join(','),

    h1:{
      fontFamily: "DM Serif Display, serif",
      fontWeight: 'bold',
      fontSize: '2rem',
    },
    h2:{
      fontFamily: "DM Serif Display, serif",
      fontWeight: 'bold',
      fontSize: '1.8rem',
    },
    h3:{
      fontFamily: "DM Serif Display, serif",
      fontWeight: 'bold',
      fontSize: '1.6rem',
    },
    h4:{
      fontFamily: "DM Serif Display, serif",
      fontWeight: 'bold',
      fontSize: '1.4rem',
    },
    h5:{
      fontFamily: "DM Serif Display, serif",
      fontWeight: 'bold',
      fontSize: '1.2rem',
    },
    h6:{
      fontFamily: "DM Serif Display, serif",
      fontWeight: 'bold',
      fontSize: '1.1rem',
    },
   }
});

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

  return (
    <Router>
      <div className="app">
        <ThemeProvider theme={theme}>
            <Header />
            <ErrorBoundary>
              <Routes>
                <Route path="/artist/new" element={<NewArtist />} />
                <Route path="/artist/:id" element={<Artist />} />
                <Route path="/profile" element={!account ? <ArtistSearch /> : <Profile />} />
                <Route path="/search" element={<ArtistSearch />} />
                <Route path="/gallery" element={<ArtistSearch view="gallery"/>} />
                {/* <Route path="/" element={<Home />} /> */}
                <Route path="/" element={<ArtistSearch />} />
              </Routes>
            </ErrorBoundary>
            <Footer>
              Created with 🖤 by the Supertrue Team . ✋🏿 hi@supertrue.com
            </Footer>
          </ThemeProvider>
      </div>
    </Router>

  );
}
