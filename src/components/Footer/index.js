import React from "react";
import { Box, Link, Container } from "@mui/material";
// import './Footer.scss';

export default function Footer(props) {
  return (
    <Container maxWidth="md">
    <Box className="app-footer">
      <div className="inner">
        {props.children}
      </div>
    </Box>
    </Container>
  );
}
