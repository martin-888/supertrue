import React from "react";
// import { Box } from "@mui/material";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { grey } from '@mui/material/colors';

// import Home from "./pages/Home";
import Artist from "./pages/Artist";
import NewArtist from "./pages/NewArtist";
import Assets from "./pages/Assets";
import ArtistSearch from "pages/ArtistSearch";

import Header from "./components/Header";
import Footer from "./components/Footer";

import 'App.scss';

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

export default function App() {
  return (
    <Router>
      <div className="app">
        <ThemeProvider theme={theme}>
            <Header />
            <Routes>
              <Route path="/artist/new" element={<NewArtist />} />
              <Route path="/artist/:id" element={<Artist />} />
              <Route path="/assets" element={<Assets />} />
              <Route path="/search" element={<ArtistSearch />} />
              <Route path="/gallery" element={<ArtistSearch view="gallery"/>} />
              {/* <Route path="/" element={<Home />} /> */}
              <Route path="/" element={<ArtistSearch />} />
            </Routes>
            <Footer>
              Created with 🖤 by the Supetrue Team . ✋🏿 hi@supertrue.com
            </Footer>
          </ThemeProvider>
      </div>
    </Router>

  );
}
