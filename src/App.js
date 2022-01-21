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

import Header from "./components/Header";

export default function App() {
  return (
    <Router>
      <div>
        <Header />
        <Box sx={{ m: 4 }} />
        <Routes>
          <Route path="/artist/new" element={<NewArtist />} />
          <Route path="/artist/:id" element={<Artist />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}
