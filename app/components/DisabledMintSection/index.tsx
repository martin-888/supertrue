import React from "react";
import { Box, Typography, Button, Grid } from "@mui/material";

import LivePreviewNFT from "~/components/LivePreviewNFT";
import { breakLongHandle } from "~/utils/breakLongHandle";

const styles = {
  disabledContainer: {
    opacity: 0.6,
  },
  title: {
    maxWidth: "80%",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  image: {
    maxWidth: "385px",
    maxHeight: "385px",
  },
  price: {
    textTransform: "uppercase",
    fontWeight: "bold",
  },
};

type DisabledMintSection = {
  igHandle: string;
  placeInLine?: number;
};

export default function DisabledMintSection({
  igHandle,
  placeInLine = 1,
}: DisabledMintSection) {
  return (
    <Grid container sx={styles.disabledContainer}>
      <Grid item md={6}>
        <div style={styles.image}>
          <LivePreviewNFT
            title={"@" + breakLongHandle(igHandle)}
            key={igHandle}
          />
        </div>
      </Grid>
      <Grid item sm={12} md={6} sx={{ paddingTop: { xs: 6, md: 0 } }}>
        <Typography variant="h2" sx={styles.title}>
          MINT @{igHandle}
        </Typography>

        <Box sx={{ my: 3 }}>
          <Typography variant="h5" style={styles.price}>
            Price
          </Typography>
          <Typography>$10 USD (example)</Typography>
          <br />
          <Typography variant="subtitle2">
            Price goes up per each additional NFT created.
          </Typography>
        </Box>
        <Box>
          <Button size="large" variant="contained" disabled>
            Mint #{placeInLine}
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
}
