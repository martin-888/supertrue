import React from "react";
import {
  Container,
  Typography,
} from "@mui/material";

const styles = {
  title: { marginBottom: "5em" },
};

export default function NotFound() {
  return (
    <Container maxWidth="md">
      <Typography variant="h1" sx={styles.title}>
        Page not found.
      </Typography>
    </Container>
  );
}
