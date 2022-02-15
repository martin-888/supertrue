import React from "react";
import NavBar from "./NavBar";
// import { Box, Link } from "@mui/material";
// import './Header.scss';

export default function Header() {
  return (<NavBar />);
  /*
  return (
    <Box className="app-header" sx={{
      display: 'grid',
      justifyContent: "space-around",
      borderBottom: "3px solid black",
      padding: "2em",
    }}>
      <Link href="/" underline="none" variant="h3" className="app-logo">SUPERTRUE</Link>
    </Box>
  );
  */
}
