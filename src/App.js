import React from "react";
import { Box } from "@mui/material";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import Home from "./pages/Home";
import Artist from "./pages/Artist";
import NewArtist from "./pages/NewArtist";
import Me from "./pages/Me";

import Header from "./components/Header";

import { ThemeProvider, createTheme } from '@mui/material/styles';
import { grey } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    primary: {
      main: grey[900],
    },
    secondary: {
      main: grey[50],
    }
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
              <Route path="/" element={<Home />} />
            </Routes>
          </ThemeProvider>
      </div>
    </Router>
    
  );
}
