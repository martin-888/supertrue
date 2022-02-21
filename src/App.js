import React from "react";
import { Box } from "@mui/material";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

// import Home from "./pages/Home";
import Artist from "./pages/Artist";
import NewArtist from "./pages/NewArtist";
import Me from "./pages/Me";
import ArtistSearch from "pages/ArtistSearch";

import Header from "./components/Header";

import { ThemeProvider, createTheme } from '@mui/material/styles';
import { grey } from '@mui/material/colors';

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
      fontFamily: 'DM Serif Display, serif',
      fontSize: '2rem',
      fontWeight: 'bold',
    },
    h2:{
      fontFamily: 'DM Serif Display, serif',
      fontSize: '1.6rem',
      fontWeight: 'bold',
    },
    h6:{
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
            <Box sx={{ m: 4 }} />
            <Routes>
              <Route path="/artist/new" element={<NewArtist />} />
              <Route path="/artist/:id" element={<Artist />} />
              <Route path="/me" element={<Me />} />
              <Route path="/search" element={<ArtistSearch />} />
              <Route path="/gallery" element={<ArtistSearch view="gallery"/>} />
              {/* <Route path="/" element={<Home />} /> */}
              <Route path="/" element={<ArtistSearch />} />
            </Routes>
          </ThemeProvider>
      </div>
    </Router>
    
  );
}
