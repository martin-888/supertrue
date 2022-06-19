import React from "react";
import { Box, Container, Typography } from "@mui/material";

import footerImage from "../../assets/img/myCanvas-inverted_1000x350px.png";

const styles = {
  bgImageContainer: { height: "100px" },
  bgImageOverlay: {
    height: "100px",
    width: "100%",
    backgroundImage: "linear-gradient(#ffffff, #ffffffc9, #ffffff)",
    zIndex: 2,
    position: "absolute",
  },
  bgImage: {
    height: "100px",
    width: "100%",
    maxHeight: "700px",
    backgroundImage: `url(${footerImage})`,
    opacity: 0.5,
    backgroundRepeat: "repeat-x",
    backgroundPosition: "center",
    zIndex: 1,
    position: "absolute",
  },
};

export default function Footer() {
  return (
    <>
      <Box fullWidth sx={styles.bgImageContainer}>
        <Box sx={styles.bgImageOverlay} />
        <Box sx={styles.bgImage} />
      </Box>
      <Container maxWidth="md">
        <Box className="app-footer">
          <Typography className="inner" textAlign="center" pb={2}>
            Created with 🖤 by the Supertrue Team. ✋🏿 hi@supertrue.com
          </Typography>
        </Box>
      </Container>
    </>
  );
}
