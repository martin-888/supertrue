import React from "react";
import { Box, Link } from "@mui/material";
// import './Footer.scss';

export default function Footer(props) {
  return (
    <Box className="app-footer" sx={{
      display: 'grid',
      justifyContent: "space-around",
      // borderTop: "3px solid black",
      paddingTop: "2em",
    }}>
      <div className="inner">
        {props.children}
      </div>
    </Box>
  );
}
