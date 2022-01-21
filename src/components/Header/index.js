import React from "react";
import { Box, Link } from "@mui/material";

export default function Header() {
  return (
    <Box sx={{
      display: 'grid',
      justifyContent: "space-around",
      borderBottom: "3px solid black",
      padding: "2em",
    }}>
      <Link href="/" underline="none" variant="h3">SUPERTRUE</Link>
    </Box>
  );
}
